"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CheckAvailability() {
  const [pincode, setPincode] = useState("");
  const router = useRouter();

  const handleCheck = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${pincode}`);
      const data = await response.json();
      
      if (data.serviceable) {
        router.push("/congrats");
      } else {
        router.push("/not-available");
      }
    } catch (error) {
      router.push("/not-available");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Check Availability</h2>
          <span className="w-6" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Image src="/Pincode availablity screen.png" alt="Check Availability" width={288} height={288} className="mb-6" />
        <p className="text-center text-gray-600 font-medium mb-8">
          Enter your area pincode to check<br />service availability
        </p>
        
        <div className="w-full max-w-md space-y-4">
          <input
            type="tel"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-lg text-black placeholder:text-gray-400 outline-none focus:ring-2"
            style={{ outlineColor: '#452D9B' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #452D9B'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
            maxLength={6}
          />
          
          <button 
            onClick={handleCheck}
            disabled={pincode.length !== 6}
            className="w-full text-white rounded-xl py-4 text-lg font-semibold"
            style={pincode.length === 6 ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}
