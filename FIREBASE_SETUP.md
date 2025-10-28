# Firebase Authentication Setup (Spark Plan - Free)

## Overview
Switched from Twilio to Firebase Authentication for SMS OTP verification. Firebase Spark plan is free and includes phone authentication.

## Setup Steps

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "Laundry Management"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Phone Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Phone** and enable it
3. Save

### 3. Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** icon (</>) to add web app
4. Register app name: "Laundry Customer"
5. Copy the `firebaseConfig` object

### 4. Add Environment Variables

**Customer App** - Create `customer/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Partner App** - Create `partner/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Add Authorized Domains
1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add:
   - `localhost`
   - Your production domain (when deploying)

## Testing

### Run All Apps
```bash
# Terminal 1 - Admin Panel
cd "admin panel"
npm run dev

# Terminal 2 - Customer App
cd customer
npm run dev

# Terminal 3 - Partner App
cd partner
npm run dev
```

### Test Login Flow
1. Open Customer app at http://localhost:3001
2. Enter phone number (any valid number)
3. Complete reCAPTCHA (invisible)
4. Receive OTP via SMS
5. Enter OTP to verify

## Firebase Spark Plan Limits (Free)
- **Phone Auth**: 10K verifications/month
- **Storage**: 1 GB
- **Bandwidth**: 10 GB/month
- **No credit card required**

## How It Works

1. **Customer/Partner enters phone** → Firebase sends SMS OTP
2. **User enters OTP** → Firebase verifies
3. **On success** → Get Firebase ID token
4. **Backend** → Exchanges Firebase token for JWT
5. **JWT stored** → Used for subsequent API calls

## Files Modified

### Backend
- `admin panel/app/api/auth/send-otp/route.ts` - Simplified (client-side Firebase)
- `admin panel/app/api/auth/verify-otp/route.ts` - Accepts Firebase token

### Frontend
- `customer/src/lib/firebase.ts` - Firebase config
- `customer/src/pages/Login.tsx` - Firebase phone auth
- `customer/src/pages/VerifyMobile.tsx` - Firebase OTP verification
- `partner/src/lib/firebase.ts` - Firebase config
- `partner/src/app/login/page.tsx` - Firebase phone auth (to be updated)
- `partner/src/app/verify/page.tsx` - Firebase OTP verification (to be updated)

## Advantages Over Twilio
✅ Free tier (10K verifications/month)
✅ No credit card required
✅ No trial limitations
✅ Works with any phone number
✅ Built-in reCAPTCHA protection
✅ Automatic rate limiting
✅ Better security (client-side verification)

## Production Deployment
1. Add production domain to Firebase Authorized domains
2. Update API URLs from localhost to production
3. Enable App Check for additional security
4. Monitor usage in Firebase Console
