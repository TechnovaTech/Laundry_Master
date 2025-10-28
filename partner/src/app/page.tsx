"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/check-availability"), 1800);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0D6EFD] text-white flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center text-center">
        <div className="mx-auto size-40 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-4xl">🛵</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Steam Iron Partner</h1>
        <p className="mt-2 text-base opacity-90">Smart pickups & fast deliveries</p>
        <div className="mt-4 flex gap-2">
          <span className="loading-dot bg-white/90" style={{ animationDelay: "0ms" }} />
          <span className="loading-dot bg-white/80" style={{ animationDelay: "150ms" }} />
          <span className="loading-dot bg-white/80" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="mt-3 text-sm opacity-90">Initializing...</p>
      </div>

      <p className="absolute bottom-8 text-base opacity-90">Checking assignments...</p>
    </div>
  );
}
