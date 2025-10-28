'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Order {
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
  totalAmount: number;
  items: any[];
  specialInstructions?: string;
  status: string;
}

interface Hub {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  contactPerson?: string;
  contactNumber?: string;
}

export default function PickupConfirm() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [hub, setHub] = useState<Hub | null>(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders`);
      const data = await response.json();
      
      if (data.success) {
        const foundOrder = data.data.find((o: any) => o._id === params.id);
        setOrder(foundOrder);
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
    <div className="pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={`/pickups/start/${params.id}`} className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Confirm</h2>
          <span className="w-6" />
        </div>
      </header>

      {/* Order summary card */}
      <div className="mt-3 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-black">Order ID: #{order.orderId}</p>
            <p className="mt-2 text-sm text-black">Customer: {order.customerId?.name || 'Customer'}</p>
            <p className="text-sm text-black">Phone: {order.customerId?.mobile}</p>
            <p className="mt-2 text-sm text-black">📍 {order.pickupAddress.street}, {order.pickupAddress.city}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.pickupAddress.street}, ${order.pickupAddress.city}`)}`} target="_blank" className="mt-3 inline-flex items-center rounded-lg border-2 px-4 py-2 text-sm font-semibold" style={{ borderColor: '#b8a7d9', color: '#452D9B' }}>Open in Maps</a>
          </div>
          <span className="rounded-lg border-2 px-3 py-1 text-sm font-semibold" style={{ borderColor: '#b8a7d9', color: '#452D9B' }}>
            {order.status === 'reached_location' ? 'Reached Location' : order.status === 'picked_up' ? 'Picked Up' : order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Upload section */}
      <div className="mt-4 mx-4">
        <p className="text-base font-semibold text-black">Upload Clothes Photos (Min 2)</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center relative overflow-hidden">
              <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer relative overflow-hidden">
            <span style={{ color: '#452D9B' }}>📷</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPhotos([...photos, reader.result as string]);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">Upload at least 2 photos of the clothes</p>
        
        <button
          onClick={async () => {
            if (photos.length < 2) {
              alert('Please upload at least 2 photos');
              return;
            }
            try {
              const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pickupPhotos: photos })
              });
              if (response.ok) {
                alert('Images uploaded successfully!');
              } else {
                alert('Failed to upload images');
              }
            } catch (error) {
              console.error('Failed to upload images:', error);
              alert('Failed to upload images');
            }
          }}
          disabled={photos.length < 2}
          className="mt-3 w-full inline-flex justify-center items-center bg-green-600 text-white rounded-xl py-3 text-base font-semibold disabled:bg-gray-400"
        >
          Upload Images ({photos.length})
        </button>

        <input
          className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-3 text-base text-black placeholder:text-gray-600 outline-none"
          onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
          onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
          placeholder="Add Notes (optional)…"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="mt-2 text-xs text-gray-500">Example: Customer gave extra bedsheet.</p>
      </div>

      {/* Checkbox and CTA */}
      <div className="mx-4 mt-3">
        <label className="flex items-center gap-2 text-base text-black">
          <input type="checkbox" className="h-4 w-4" style={{ accentColor: '#452D9B' }} checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          I have collected all items from customer.
        </label>
        <button
          onClick={async () => {
            if (!confirmed) {
              alert('Please confirm you have collected all items');
              return;
            }
            try {
              const updateData = { 
                status: 'picked_up',
                pickupNotes: notes,
                pickedUpAt: new Date().toISOString()
              };
              const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
              });
              if (response.ok) {
                window.location.href = '/hub/drop';
              }
            } catch (error) {
              console.error('Failed to update order:', error);
            }
          }}
          disabled={!confirmed || order.status !== 'reached_location'}
          className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
          style={confirmed && order.status === 'reached_location' ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {order.status === 'reached_location' ? 'Confirm & Proceed' : 'Already Picked Up'}
        </button>
      </div>
    </div>
  );
}