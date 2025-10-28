"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);
  
  const handleOAuthCallback = async (code: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/partner-google-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('partnerToken', data.token);
        localStorage.setItem('partnerId', data.partnerId);
        localStorage.setItem('partnerName', data.name);
        router.push('/pickups');
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
        
        const googleResponse = await fetch('http://localhost:3000/api/auth/partner-google-callback', {
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
          localStorage.setItem('partnerToken', data.token);
          localStorage.setItem('partnerId', data.partnerId);
          localStorage.setItem('partnerName', data.name);
          router.push('/pickups');
        }
      } else {
        // Direct OAuth URL approach to bypass GSI issues
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = encodeURIComponent('http://localhost:3002/login');
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
    if (!mobile || mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const phone = `+91${mobile}`;
      const response = await fetch("http://localhost:3000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("partnerMobile", mobile);
        router.push("/verify");
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3" suppressHydrationWarning>
          <Link href="/" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Login</h2>
          <span className="w-6" />
        </div>
      </header>

      <div className="px-4 pt-6 flex flex-col items-center" suppressHydrationWarning>
        <Image src="/scooter.svg" alt="Delivery Partner" width={220} height={140} />
        <p className="mt-4 text-sm text-gray-500">Sign in to your account.</p>
      </div>

      <div className="px-4 mt-10" suppressHydrationWarning>
        <label className="block text-lg font-medium text-black">Please enter your mobile no :</label>
        <div className="mt-3 relative" suppressHydrationWarning>
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>👤</span>
          <input
            className="w-full rounded-xl border pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Enter your phone no"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
          />
        </div>
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="mt-5 w-full text-white rounded-xl py-3 text-base font-semibold"
          style={!loading ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-xl py-3 text-base font-semibold shadow-lg hover:bg-gray-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}