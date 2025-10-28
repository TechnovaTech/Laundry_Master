@echo off
echo Installing Twilio dependencies in Admin Panel...
cd "admin panel"
call npm install twilio jsonwebtoken
call npm install --save-dev @types/jsonwebtoken
echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Update .env.local with your Twilio credentials
echo 2. Run: npm run dev
echo 3. Test the login flow with a verified phone number
echo.
pause
