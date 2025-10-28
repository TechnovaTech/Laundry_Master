import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    
    const user = await AdminUser.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if password is hashed or plain text
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is hashed, use bcrypt
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text, direct comparison
      isPasswordValid = password === user.password;
    }
    
    if (isPasswordValid) {
      return NextResponse.json({ 
        success: true, 
        data: { 
          role: user.role, 
          email: user.email, 
          username: user.username,
          hub: user.hub || null
        } 
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}
