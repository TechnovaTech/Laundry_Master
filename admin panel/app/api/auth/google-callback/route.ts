import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Authorization code is required' }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3001/login'
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, error: 'Failed to get access token' }, { status: 400 });
    }

    // Get user info
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    if (!userData.email) {
      return NextResponse.json({ success: false, error: 'Failed to get user info' }, { status: 400 });
    }

    await dbConnect();

    // Check if customer exists
    let customer = await Customer.findOne({ email: userData.email });

    if (!customer) {
      // Create new customer
      customer = new Customer({
        name: userData.name,
        email: userData.email,
        profilePicture: userData.picture,
        isGoogleUser: true,
        createdAt: new Date()
      });
      await customer.save();
      console.log('New Google customer created:', customer._id);
    } else {
      console.log('Existing customer found:', customer._id);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const authToken = jwt.sign(
      { customerId: customer._id, email: userData.email, role: 'customer' },
      jwtSecret,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token: authToken,
      customerId: customer._id,
      name: customer.name,
      email: customer.email
    });

  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Google login failed'
    }, { status: 500 });
  }
}