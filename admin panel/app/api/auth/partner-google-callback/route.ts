import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, email, name, picture } = body;

    let userEmail, userName, userPicture;

    if (code) {
      // Handle OAuth code flow

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3002/login'
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

      userEmail = userData.email;
      userName = userData.name;
      userPicture = userData.picture;
    } else if (email && name) {
      // Handle direct user data (from mobile)
      userEmail = email;
      userName = name;
      userPicture = picture;
    } else {
      return NextResponse.json({ success: false, error: 'Code or user data required' }, { status: 400 });
    }

    await dbConnect();

    // Check if partner exists
    let partner = await Partner.findOne({ email: userEmail });

    if (!partner) {
      // Create new partner
      partner = new Partner({
        name: userName,
        email: userEmail,
        profilePicture: userPicture,
        isGoogleUser: true,
        status: 'pending',
        createdAt: new Date()
      });
      await partner.save();
      console.log('New Google partner created:', partner._id);
    } else {
      console.log('Existing partner found:', partner._id);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const authToken = jwt.sign(
      { partnerId: partner._id, email: userEmail, role: 'partner' },
      jwtSecret,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token: authToken,
      partnerId: partner._id,
      name: partner.name,
      email: partner.email
    });

  } catch (error: any) {
    console.error('Partner Google callback error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Google login failed'
    }, { status: 500 });
  }
}