"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Congrats() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Image src="/Congrats we are available.png" alt="Congrats" width={288} height={288} className="mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
      <p className="text-center text-gray-600 mb-8">
        We are available in your area.<br />Let&apos;s get you started!
      </p>
      
      <button 
        onClick={() => router.push("/login")}
        className="w-full max-w-md text-white rounded-xl py-4 text-lg font-semibold"
        style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
      >
        Continue to Login
      </button>
    </div>
  );
}
