"use client";
import { useRouter } from "next/navigation";

export default function NotAvailable() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-8xl mb-6">😔</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sorry!</h1>
      <p className="text-center text-gray-600 mb-8">
        We are not available in your area yet.<br />We&apos;ll notify you when we expand!
      </p>
      
      <button 
        onClick={() => router.push("/check-availability")}
        className="w-full max-w-md text-white rounded-xl py-4 text-lg font-semibold"
        style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
      >
        Try Another Pincode
      </button>
    </div>
  );
}
