"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

export default function PickForDelivery() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      const partnerRes = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const partnerData = await partnerRes.json();
      
      if (partnerData.success && partnerData.data.address?.pincode) {
        const partnerPincode = partnerData.data.address.pincode;
        
        const ordersRes = await fetch('http://localhost:3000/api/orders');
        const ordersData = await ordersRes.json();
        
        if (ordersData.success) {
          console.log('Partner pincode:', partnerPincode);
          console.log('All orders:', ordersData.data);
          const filteredOrders = ordersData.data.filter((order: any) => {
            console.log('Order:', order.orderId, 'Status:', order.status, 'Delivery Pincode:', order.deliveryAddress?.pincode, 'Pickup Pincode:', order.pickupAddress?.pincode);
            return order.status === 'process_completed' && 
                   (order.deliveryAddress?.pincode === partnerPincode || order.pickupAddress?.pincode === partnerPincode);
          });
          console.log('Filtered orders:', filteredOrders);
          setOrders(filteredOrders);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="pb-24" suppressHydrationWarning>
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-black">Pick for Delivery</h2>
          <span style={{ color: '#452D9B' }}>🔔</span>
        </div>
        <div className="text-white text-center py-2 text-sm font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>Orders ready at Main Processing Hub</div>
      </header>

      {/* Section title */}
      <div className="px-4 pt-4">
        <p className="text-base font-semibold text-black">Select Orders to Deliver ({orders.length})</p>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="mt-4 px-4 text-center text-gray-500">Loading...</div>
      ) : orders.length > 0 ? (
        <div className="mt-3 px-4 flex flex-col gap-4">
          {orders.map((order) => {
            const isSelected = selected.has(order._id);
            return (
              <div key={order._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Order ID: #{order.orderId}</p>
                    <p className="text-xs text-gray-600 mt-2">Customer: <span className="text-black">{order.customerId?.name || 'N/A'}</span></p>
                    <p className="text-xs text-gray-600 mt-1">Items: <span className="text-black">{order.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ')}</span></p>
                    <p className="text-xs text-gray-600 mt-1">Address: <span className="text-black">{order.pickupAddress?.street}, {order.pickupAddress?.city}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label={isSelected ? "Selected" : "Not selected"}
                      onClick={() => toggle(order._id)}
                      className="h-8 w-8 rounded-lg border-2 flex items-center justify-center text-white"
                      style={isSelected ? { borderColor: '#452D9B', background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { borderColor: '#b8a7d9', background: 'transparent', color: '#000' }}
                    >
                      {isSelected ? "✔" : ""}
                    </button>
                    <span style={{ color: '#452D9B' }}>ℹ️</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center">
          <p className="text-base font-semibold">No orders available for delivery.</p>
          <p className="text-xs text-gray-600">Orders ready for delivery in your area will appear here.</p>
        </div>
      )}

      {/* Confirm CTA */}
      <div className="px-4">
        <button
          onClick={() => {
            if (selected.size > 0) {
              const firstOrderId = Array.from(selected)[0];
              window.location.href = `/delivery/${firstOrderId}`;
            } else {
              alert('Please select at least one order');
            }
          }}
          disabled={orders.length === 0}
          className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
          style={orders.length > 0 ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          Confirm Selection ({selected.size})
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
