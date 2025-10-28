import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, name, picture } = body;

    let userEmail, userName, userPicture;

    if (token) {
      // Verify Google token
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
        }

        userEmail = payload.email;
        userName = payload.name;
        userPicture = payload.picture;
      } catch (tokenError) {
        console.error('Token verification failed:', tokenError);
        return NextResponse.json({ success: false, error: 'Invalid Google token' }, { status: 400 });
      }
    } else if (email && name) {
      // Direct user data
      userEmail = email;
      userName = name;
      userPicture = picture;
    } else {
      return NextResponse.json({ success: false, error: 'Token or user data required' }, { status: 400 });
    }

    console.log('Google login attempt:', { email: userEmail, name: userName });

    await dbConnect();

    // Check if customer exists
    let customer = await Customer.findOne({ email: userEmail });

    if (!customer) {
      // Create new customer
      customer = new Customer({
        name: userName,
        email: userEmail,
        profilePicture: userPicture,
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
      { customerId: customer._id, email: userEmail, role: 'customer' },
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
    console.error('Google login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Google login failed'
    }, { status: 500 });
  }
}