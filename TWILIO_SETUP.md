# Twilio SMS OTP Setup Guide

## Overview
This project now uses Twilio Verify API for SMS OTP authentication in both Customer and Partner apps.

## Installation

### Admin Panel
```bash
cd "admin panel"
npm install twilio jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

## Environment Variables

Add these to `admin panel/.env.local`:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
JWT_SECRET=your-jwt-secret
```

**⚠️ Important:** Replace with your regenerated Twilio credentials from the console.

## API Endpoints

### 1. Send OTP
**Endpoint:** `POST http://localhost:3000/api/auth/send-otp`

**Request:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "status": "pending"
}
```

### 2. Verify OTP
**Endpoint:** `POST http://localhost:3000/api/auth/verify-otp`

**Request:**
```json
{
  "phone": "+919876543210",
  "code": "123456",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "phone": "+919876543210"
}
```

## Phone Number Format

Always use **E.164 format**: `+[country code][number]`

Examples:
- India: `+919876543210`
- US: `+14155552671`

## Twilio Trial Mode Limitations

1. **Verified Numbers Only**: OTP will only be sent to phone numbers verified in your Twilio console
2. **Test Credentials**: The provided credentials are for testing - regenerate them in production
3. **Message Prefix**: Trial accounts add "Sent from your Twilio trial account" to messages

### How to Verify a Number in Twilio Console:
1. Go to https://console.twilio.com/
2. Navigate to Phone Numbers → Verified Caller IDs
3. Click "Add a new number"
4. Enter your phone number and verify it

## Testing Locally

### Step 1: Start Admin Panel
```bash
cd "admin panel"
npm run dev
```
Admin panel runs on `http://localhost:3000`

### Step 2: Start Customer App
```bash
cd customer
npm run dev
```
Customer app runs on `http://localhost:3001`

### Step 3: Start Partner App
```bash
cd partner
npm run dev
```
Partner app runs on `http://localhost:3002`

### Step 4: Test Login Flow

1. Open Customer app at `http://localhost:3001`
2. Enter a 10-digit mobile number (must be verified in Twilio)
3. Click "Log In"
4. Check your phone for the OTP SMS
5. Enter the 6-digit OTP code
6. Click "Verify & Continue"

## Error Handling

### Common Errors:

1. **"Phone number is required"** - Missing phone parameter
2. **"Twilio credentials not configured"** - Check .env.local file
3. **"Invalid or expired OTP"** - OTP is wrong or has expired (10 min validity)
4. **"Failed to send OTP"** - Phone number not verified in Twilio trial account

## Security Features

- JWT tokens expire after 30 days
- OTP codes expire after 10 minutes
- Rate limiting recommended for production (not implemented in this version)
- Tokens stored in localStorage (consider httpOnly cookies for production)

## Production Checklist

- [ ] Upgrade Twilio account (remove trial limitations)
- [ ] Regenerate all Twilio credentials
- [ ] Add rate limiting to prevent OTP spam
- [ ] Use environment-specific API URLs (not hardcoded localhost)
- [ ] Implement proper error logging
- [ ] Store tokens in httpOnly cookies instead of localStorage
- [ ] Add CORS configuration for production domains
- [ ] Set up Twilio webhook for delivery status

## Files Modified

### Backend (Admin Panel)
- `app/api/auth/send-otp/route.ts` - Send OTP endpoint
- `app/api/auth/verify-otp/route.ts` - Verify OTP endpoint
- `.env.local` - Added Twilio credentials

### Frontend (Customer App)
- `src/pages/Login.tsx` - Updated to call send-otp API
- `src/pages/VerifyMobile.tsx` - Updated to call verify-otp API with resend functionality

### Frontend (Partner App)
- `src/app/login/page.tsx` - Updated to call send-otp API
- `src/app/verify/page.tsx` - Updated to call verify-otp API

## Support

For Twilio-specific issues, check:
- Twilio Console: https://console.twilio.com/
- Twilio Verify Docs: https://www.twilio.com/docs/verify/api
- Error Codes: https://www.twilio.com/docs/api/errors
