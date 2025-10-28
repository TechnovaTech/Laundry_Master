'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function DeliveredToHub() {
  const [delivered, setDelivered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      const response = await fetch('http://localhost:3000/api/orders');
      const data = await response.json();
      
      if (data.success) {
        const filteredOrders = data.data.filter((order: any) => 
          (order.status === 'delivered_to_hub' || order.status === 'ready') && (order.partnerId?._id === partnerId || order.partnerId === partnerId)
        );
        setDelivered(filteredOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/hub/drop" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivered to Hub</h2>
          <span style={{ color: '#452D9B' }}>🔽</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none"
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            placeholder="Search by Order ID / Customer"
          />
          <button className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center" style={{ color: '#452D9B' }}>🔽</button>
        </div>
      </div>

      {/* Delivered cards */}
      {loading ? (
        <div className="mt-4 px-4 text-center text-gray-500">Loading...</div>
      ) : delivered.length > 0 ? (
        <div className="mt-4 px-4 flex flex-col gap-4">
          {delivered.map((order: any) => (
            <div key={order._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-black">#{order.orderId}</p>
                  <p className="text-sm text-gray-700 mt-2">{order.customerId?.name || 'Customer'}, <span className="text-black">{order.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items'}</span></p>
                  <p className="text-sm text-gray-600 mt-2">{order.status === 'ready' ? 'Approved on: ' : 'Delivered on: '}{order.status === 'ready' && order.hubApprovedAt ? new Date(order.hubApprovedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.hubApprovedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : order.deliveredToHubAt ? new Date(order.deliveredToHubAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredToHubAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
                </div>
                <span className={`rounded-full text-white px-3 py-1 text-xs font-semibold ${order.status === 'ready' ? 'bg-green-500' : 'bg-orange-500'}`}>{order.status === 'ready' ? 'Approved' : 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center">
          <Image src="/Delivery.svg" alt="Hub Building" width={260} height={180} className="mx-auto" />
          <p className="mt-2 text-base font-semibold">No delivered orders found.</p>
          <p className="text-xs text-black">Orders you deliver to hub will appear here.</p>
        </div>
      )}
    </div>
  );
}
