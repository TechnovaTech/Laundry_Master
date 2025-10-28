'use client'

import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function DeliveryDetails() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/delivery/pick" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivery Details</h2>
          <span style={{ color: '#452D9B' }}>🔔</span>
        </div>
      </header>

      {/* Order summary card */}
      <div className="mt-3 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-black">Order #{order.orderId}</p>
          <span className="rounded-lg text-white px-3 py-1 text-xs font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
            {order.status === 'process_completed' ? 'Ready for Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-black">{order.customerId?.name || 'Customer'}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-black">{order.customerId?.mobile}</p>
            <a href={`tel:${order.customerId?.mobile}`} className="h-8 w-8 rounded-lg text-white flex items-center justify-center" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>📞</a>
          </div>
        </div>
        <p className="mt-2 text-sm text-black">📍 {order.deliveryAddress?.street || order.pickupAddress?.street}, {order.deliveryAddress?.city || order.pickupAddress?.city}</p>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.deliveryAddress?.street || order.pickupAddress?.street}, ${order.deliveryAddress?.city || order.pickupAddress?.city}`)}`} 
          target="_blank" 
          className="mt-2 text-sm"
          style={{ color: '#452D9B' }}
        >
          Open in Maps
        </a>
      </div>

      {/* Map banner */}
      <div className="mt-3 mx-4 relative rounded-xl overflow-hidden border border-gray-200 h-48">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${order.deliveryAddress?.street || order.pickupAddress?.street}, ${order.deliveryAddress?.city || order.pickupAddress?.city}`)}&zoom=15`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Items card */}
      <div className="mt-4 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <p className="text-base font-semibold text-black">Order Items</p>
        <div className="mt-2 text-sm">
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between mt-1">
              <p className="text-black">{item.quantity} {item.name}</p>
              <p className="text-black">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold" style={{ color: '#452D9B' }}>Total Price: ₹{order.totalAmount}</p>
      </div>

      {/* CTA */}
      <div className="mx-4">
        {order.status === 'process_completed' ? (
          <button
            onClick={async () => {
              const partnerId = localStorage.getItem('partnerId');
              const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'out_for_delivery',
                  outForDeliveryAt: new Date().toISOString(),
                  partnerId: partnerId
                })
              });
              if (response.ok) {
                fetchOrder();
              } else {
                alert('Failed to start delivery');
              }
            }}
            className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
            style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
          >
            Start Delivery
          </button>
        ) : order.status === 'out_for_delivery' ? (
          <button
            onClick={async () => {
              const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'delivered',
                  deliveredAt: new Date().toISOString()
                })
              });
              if (response.ok) {
                alert('Order delivered successfully!');
                window.location.href = '/delivery/pick';
              } else {
                alert('Failed to mark as delivered');
              }
            }}
            className="mt-5 w-full inline-flex justify-center items-center bg-green-600 text-white rounded-xl py-3 text-base font-semibold"
          >
            Order Delivered
          </button>
        ) : (
          <div className="mt-5 w-full inline-flex justify-center items-center bg-gray-400 text-white rounded-xl py-3 text-base font-semibold">
            {order.status === 'delivered' ? 'Delivered' : 'Completed'}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
