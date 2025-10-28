'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

interface Pickup {
  _id: string;
  orderId: string;
  customerId: {
    name: string;
    mobile: string;
  };
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupSlot: {
    date: string;
    timeSlot: string;
  };
  status: string;
}

export default function Pickups() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      const data = await response.json();
      
      if (data.success) {
        const pendingPickups = data.data.filter((order: any) => 
          order.status === 'pending' || order.status === 'confirmed'
        );
        setPickups(pendingPickups);
      }
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Today&apos;s Pickups</h2>
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0ebf8' }}>
            <span className="text-xl">🔔</span>
          </button>
        </div>
      </header>

      {/* Map Banner */}
      <div className="mt-4 mx-4 relative rounded-2xl overflow-hidden h-40 shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Floating card */}
        <div className="absolute left-4 top-4 bg-white shadow-lg rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900">
          <span style={{ color: '#452D9B' }}>{pickups.length}</span> pickups today
        </div>
      </div>

      {/* Pickup cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading pickups...</div>
        ) : pickups.length > 0 ? (
          pickups.map((p) => (
            <div key={p._id} className="rounded-2xl bg-white card-shadow p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">{p.customerId?.name || 'Customer'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {p.pickupAddress?.street}, {p.pickupAddress?.city}
                  </p>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#452D9B' }}>
                    🕐 {p.pickupSlot?.timeSlot || 'Time not set'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">#{p.orderId}</span>
              </div>
              <div className="flex items-center gap-3">
                <a href={`tel:${p.customerId?.mobile}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold btn-press" style={{ borderColor: '#452D9B', color: '#452D9B' }}>
                  <span>📞</span>
                  Call
                </a>
                <Link href={`/pickups/start/${p._id}`} className="flex-1 inline-flex justify-center items-center text-white rounded-xl py-2.5 text-sm font-bold shadow-md btn-press" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                  Start Pickup →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-12 px-4 text-center">
            <div className="bg-white rounded-2xl p-8 card-shadow">
              <Image src="/scooter.svg" alt="Scooter" width={180} height={130} className="mx-auto opacity-80" />
              <p className="mt-4 text-lg font-bold text-gray-900">No pickups assigned yet</p>
              <p className="text-sm text-gray-500 mt-2">Orders will appear here once assigned</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
