import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getOTP, deleteOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { phone, code, role } = await request.json();

    console.log('\n🔍 VERIFY OTP REQUEST');
    console.log('Phone:', phone);
    console.log('Code:', code);
    console.log('Role:', role);

    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Phone and code are required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const storedOtp = getOTP(phone);

    console.log('Stored OTP:', storedOtp);
    console.log('All stored OTPs:', Array.from(otpStore.entries()));

    // Only accept stored OTP
    const isValidOtp = storedOtp === code;

    if (isValidOtp) {
      if (storedOtp) deleteOTP(phone);
      
      const token = jwt.sign(
        { phone, role: role || 'customer' },
        jwtSecret,
        { expiresIn: '30d' }
      );

      console.log('\n✅ OTP Verified Successfully for:', phone, '\n');

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        phone
      });
    }
    
    return NextResponse.json({
      success: false,
      error: storedOtp ? 'Invalid OTP' : 'OTP expired. Please request new OTP.'
    }, { status: 400 });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to verify OTP'
    }, { status: 500 });
  }
}
