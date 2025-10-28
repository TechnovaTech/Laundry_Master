import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginPersonImg from "@/assets/LOGIN.png";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Exchange code for user info
      handleOAuthCallback(code);
    }
  }, []);
  
  const handleOAuthCallback = async (code: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('customerId', data.customerId);
        localStorage.setItem('userName', data.name);
        window.dispatchEvent(new Event('userNameChanged'));
        navigate('/home');
      } else {
        alert(data.error || 'Google login failed');
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('OAuth callback failed:', error);
      alert('Google login failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check if running in browser or mobile
      const { Capacitor } = await import('@capacitor/core');
      
      if (Capacitor.isNativePlatform()) {
        // Mobile app - use Capacitor plugin
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        const result = await GoogleAuth.signIn();
        
        const googleResponse = await fetch('http://localhost:3000/api/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: result.email,
            name: result.name,
            picture: result.imageUrl
          })
        });
        const data = await googleResponse.json();
        
        if (data.success) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('customerId', data.customerId);
          localStorage.setItem('userName', data.name);
          window.dispatchEvent(new Event('userNameChanged'));
          navigate('/home');
        }
      } else {
        // Direct OAuth URL approach to bypass GSI issues
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = encodeURIComponent('http://localhost:3001/login');
        const scope = encodeURIComponent('profile email');
        const responseType = 'code';
        
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline`;
        
        // Open in same window for now
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (mobileNumber.length === 10) {
      try {
        const phone = `+91${mobileNumber}`;
        const response = await fetch('http://localhost:3000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('userMobile', mobileNumber);
          navigate("/verify-mobile", { state: { mobileNumber } });
        } else {
          alert(data.error || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
      <div className="flex flex-1 flex-col items-center">
        <h1 className="mb-4 sm:mb-6 self-start text-2xl sm:text-3xl font-bold text-black">
          Let's log into your<br />account →
        </h1>
        
        <div className="mb-4 sm:mb-6 w-full max-w-xs sm:max-w-sm">
          <img 
            src={loginPersonImg}
            alt="Login" 
            className="w-full h-64 sm:h-80 object-contain"
          />
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
          <div>
            <label className="mb-2 block text-left text-base sm:text-lg text-black font-medium">
              Please enter your mobile no :
            </label>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              className="rounded-xl border-2 border-blue-500 py-3 sm:py-4 text-sm sm:text-base"
              maxLength={10}
              inputMode="tel"
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            disabled={mobileNumber.length !== 10}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            Log In
          </Button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-50 flex items-center justify-center gap-3"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    google: any;
  }
}

export default Login;