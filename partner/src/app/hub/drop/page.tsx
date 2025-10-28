'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

export default function DropToHub() {
  const [hub, setHub] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    fetchHubAndOrders();
  }, []);

  const fetchHubAndOrders = async () => {
    const partnerId = localStorage.getItem('partnerId');
    const partnerRes = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
    const partnerData = await partnerRes.json();
    
    if (partnerData.success && partnerData.data.address?.pincode) {
      const hubRes = await fetch(`http://localhost:3000/api/hubs?pincode=${partnerData.data.address.pincode}`);
      const hubData = await hubRes.json();
      if (hubData.success && hubData.data.length > 0) setHub(hubData.data[0]);
    }

    const ordersRes = await fetch(`http://localhost:3000/api/orders`);
    const ordersData = await ordersRes.json();
    if (ordersData.success) {
      setOrders(ordersData.data.filter((o: any) => o.partnerId?._id === partnerId && o.status === 'picked_up'));
    }
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-black">Drop To Hub</h2>
          <span style={{ color: '#452D9B' }}>🔔</span>
        </div>
      </header>

      {/* Map */}
      {hub && (
        <div className="mt-3 mx-4 relative rounded-xl overflow-hidden h-48">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${hub.address.street}, ${hub.address.city}, ${hub.address.state}`)}&zoom=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute left-4 bottom-4 bg-white shadow-sm rounded-xl px-4 py-2">
            <p className="text-sm font-semibold text-black">{hub.name}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hub.address.street}, ${hub.address.city}`)}`} target="_blank" className="text-xs" style={{ color: '#452D9B' }}>Open in Google Maps</a>
          </div>
        </div>
      )}

      {/* Orders to Drop */}
      <div className="mt-4 mx-4">
        <p className="text-base font-semibold text-black">Orders to Drop ({orders.length})</p>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="mt-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order._id]);
                      } else {
                        setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                      }
                    }}
                    className="mt-1 w-4 h-4"
                    style={{ accentColor: '#452D9B' }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-black">Order ID: #{order.orderId}</p>
                    <p className="text-xs text-black mt-1">{order.items?.length || 0} items</p>
                    <span className="mt-1 text-xs" style={{ color: '#452D9B' }}>Picked Up</span>
                  </div>
                </div>
                <span className="text-sm text-black">{order.customerId?.name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-6 text-center">
            <Image src="/window.svg" alt="Hub" width={200} height={140} className="mx-auto" />
            <p className="mt-2 text-base font-semibold">No orders to deliver.</p>
            <p className="text-xs text-black">Pickups will appear here after collection.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4">
        <button
          onClick={async () => {
            const ordersToUpdate = selectedOrders.length > 0 ? selectedOrders : orders.map(o => o._id);
            const updatePromises = ordersToUpdate.map(orderId => 
              fetch(`http://localhost:3000/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'delivered_to_hub',
                  deliveredToHubAt: new Date().toISOString()
                })
              })
            );
            await Promise.all(updatePromises);
            window.location.href = '/hub/delivered';
          }}
          disabled={orders.length === 0}
          className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
          style={orders.length > 0 ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          Delivered to Hub ({selectedOrders.length > 0 ? selectedOrders.length : orders.length})
        </button>
      </div>
      <BottomNav />
    </div>
  );
}