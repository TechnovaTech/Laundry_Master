# Twilio Setup Fix

## ⚠️ Issue: Wrong Service SID

The `TWILIO_VERIFY_SERVICE_SID` you provided starts with `SK` which is an **API Key**, not a **Verify Service SID**.

A Verify Service SID should start with `VA` (e.g., `VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## 🔧 How to Get the Correct Verify Service SID

### Option 1: Create a Verify Service (Recommended)

1. Go to https://console.twilio.com/us1/develop/verify/services
2. Click **"Create new"** or **"Create Service"**
3. Enter a friendly name (e.g., "Laundry App OTP")
4. Click **"Create"**
5. Copy the **Service SID** (starts with `VA`)
6. Update `.env.local`:

```env
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option 2: Use Existing Verify Service

1. Go to https://console.twilio.com/us1/develop/verify/services
2. If you already have a service, click on it
3. Copy the **Service SID** from the top
4. Update `.env.local`

## 📝 Complete .env.local Example

```env
MONGODB_URI=mongodb://localhost:27017/laundry
JWT_SECRET=your-secret-key-here
NODE_ENV=development
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
```

## 🔄 After Updating

1. **Restart the admin panel server:**
   ```bash
   cd "admin panel"
   npm run dev
   ```

2. **Test the login flow again**

## 🆘 Still Getting Errors?

Check the admin panel terminal for detailed error messages. Common issues:

- **"Invalid credentials"** - Check Account SID and Auth Token
- **"Service not found"** - Verify Service SID is correct (starts with VA)
- **"Phone number not verified"** - Add your phone to verified numbers in trial mode
- **"Invalid phone number"** - Ensure E.164 format: +919876543210

## 📞 Verify Your Phone Number (Trial Mode)

1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **"Add a new number"**
3. Enter your phone number with country code
4. Verify via SMS or call
5. Use this verified number for testing
