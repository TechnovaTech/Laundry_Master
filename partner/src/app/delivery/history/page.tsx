'use client'

import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";

export default function DeliveryHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      const response = await fetch('http://localhost:3000/api/orders');
      const data = await response.json();
      
      if (data.success) {
        const deliveredOrders = data.data.filter((order: any) => 
          order.status === 'delivered' && order.partnerId?._id === partnerId
        );
        setHistory(deliveredOrders);
      }
    } catch (error) {
      console.error('Failed to fetch delivery history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/delivery/pick" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivery History</h2>
          <span style={{ color: '#452D9B' }}>🔽</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-3">
        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none"
          onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          placeholder="Search by Order ID or Customer"
        />
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-lg text-white px-3 py-1 text-xs font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>This Week</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">Last Week</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">This Month</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">Custom</button>
        </div>
      </div>

      {/* History cards */}
      {loading ? (
        <div className="mt-4 px-4 text-center text-gray-500">Loading...</div>
      ) : history.length > 0 ? (
        <div className="mt-4 px-4 flex flex-col gap-4">
          {history.map((order) => (
            <div key={order._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-black">Order #{order.orderId}</p>
                  <p className="text-xs text-gray-600 mt-2">{order.customerId?.name || 'Customer'}, <span className="text-black">{order.deliveryAddress?.street || order.pickupAddress?.street}, {order.deliveryAddress?.city || order.pickupAddress?.city}</span></p>
                  <p className="text-xs text-gray-600 mt-2">Delivered on: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
                </div>
                <span className="rounded-full bg-green-500 text-white px-3 py-1 text-xs font-semibold">Delivered</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center">
          <Image src="/Delivery.svg" alt="Delivery" width={220} height={160} className="mx-auto" />
          <p className="mt-2 text-base font-semibold">No delivery history yet.</p>
          <p className="text-xs text-black">Completed orders will appear here.</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
