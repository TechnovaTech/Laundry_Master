import { NextResponse } from 'next/server';
import { setOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOTP(phone, otp);
    
    console.log('\n========================================');
    console.log('📱 OTP GENERATED');
    console.log('Phone:', phone);
    console.log('OTP:', otp);
    console.log('========================================\n');

    // Send real SMS
    if (process.env.SMS_INDORI_TOKEN) {
      try {
        const message = `Your ${process.env.COMPANY_NAME || 'Laundry'} OTP is: ${otp}. Valid for 5 minutes.`;
        const mobile = phone.replace('+91', '');
        
        const url = `${process.env.SMS_INDORI_BASE_URL}?authentic-key=${process.env.SMS_INDORI_TOKEN}&senderid=${process.env.SMS_INDORI_SENDER_ID}&route=${process.env.SMS_INDORI_ROUTE}&number=${mobile}&message=${encodeURIComponent(message)}&templateid=${process.env.SMS_INDORI_TEMPLATE_ID}`;
        
        const response = await fetch(url);
        const result = await response.text();
        
        console.log('✅ SMS sent via SMS Indori:', result);
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send OTP'
    }, { status: 500 });
  }
}


