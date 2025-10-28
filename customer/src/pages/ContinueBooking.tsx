import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, Shirt, CheckCircle2, MapPin, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeafletMap from "@/components/LeafletMap";

const ContinueBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  
  const itemsText = orderData.items ? orderData.items.map((item: any) => `${item.quantity} ${item.name}`).join(', ') : '3 Shirts, 1 Bedsheet';
  const totalAmount = orderData.total || 120;
  const finalAmount = totalAmount - discount;
  
  useEffect(() => {
    fetchCustomerInfo();
    fetchPastOrders();
  }, []);
  
  const fetchCustomerInfo = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setCustomerInfo(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer info:', error);
    }
  };
  
  const fetchPastOrders = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/orders?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const recentOrder = data.data.slice(0, 1);
        setPastOrders(recentOrder);
      }
    } catch (error) {
      console.error('Failed to fetch past orders:', error);
    }
  };
  
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/vouchers');
      const data = await response.json();
      
      if (data.success) {
        const voucher = data.data.find((v: any) => v.code === couponCode.trim());
        
        if (voucher) {
          const discountAmount = Math.floor((totalAmount * voucher.discount) / 100);
          setDiscount(discountAmount);
          setAppliedVoucher(voucher);
          setCouponError("");
        } else {
          setCouponError("Invalid coupon code");
          setDiscount(0);
          setAppliedVoucher(null);
        }
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#452D9B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#07C8D0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      <header className="text-white px-4 sm:px-6 py-5 flex items-center justify-between shadow-lg" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center mx-4">Final Step</h1>
        <button className="flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black text-sm sm:text-base">Order #{Math.floor(Math.random() * 90000) + 10000}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{itemsText}</p>
                <p className="text-base sm:text-lg font-bold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{totalAmount}</p>
              </div>
            </div>
            <span className="px-2 sm:px-4 py-1 sm:py-1.5 text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
              In Progress
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg relative overflow-hidden">
          <div className="mb-3 sm:mb-4 h-32 sm:h-48 rounded-xl overflow-hidden relative">
            {customerInfo?.address?.[0] ? (
              <LeafletMap address={customerInfo.address[0]} />
            ) : (
              <div className="h-full bg-blue-50 rounded-xl flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="w-8 h-8 mx-auto mb-2" style={{ stroke: 'url(#gradient)' }} />
                  <p className="text-xs font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>No address</p>
                  <p className="text-xs" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Add address to see map</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg z-10">
              <p className="text-xs sm:text-sm font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Arriving in 25 min</p>
            </div>
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-12 h-16 sm:w-16 sm:h-20 bg-white rounded-lg shadow-lg p-1.5 sm:p-2 z-10">
              <div className="w-full h-6 sm:h-8 bg-blue-100 rounded flex items-center justify-center mb-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" style={{ stroke: 'url(#gradient)' }} />
              </div>
              <div className="space-y-0.5">
                <div className="h-1 bg-green-500 rounded"></div>
                <div className="h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold bg-white border border-gray-300 text-black hover:bg-gray-50 text-xs sm:text-sm">
              Contact Partner
            </Button>
            <Button className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold bg-white border border-red-300 text-red-500 hover:bg-red-50 text-xs sm:text-sm">
              Report Issue
            </Button>
          </div>
        </div>

        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Past Orders</h2>
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2 gap-3">
                <p className="font-bold text-black text-sm sm:text-base">Order #{pastOrders[0].orderId}</p>
                <span className="px-2 sm:px-4 py-1 text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                  {pastOrders[0].status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">{pastOrders[0].items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items'}</p>
              <button 
                onClick={() => navigate("/order-details", { state: { orderId: pastOrders[0].orderId, order: pastOrders[0] } })}
                className="font-semibold text-xs sm:text-sm"
                style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                View Details
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Additional Information</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-2 text-xs sm:text-sm text-gray-600">
            <p>Delivery Address: {customerInfo?.address?.[0] ? `${customerInfo.address[0].street}, ${customerInfo.address[0].city}, ${customerInfo.address[0].state} - ${customerInfo.address[0].pincode}` : 'No address found'}</p>
            <p>Contact Number: {customerInfo?.mobile || 'Not provided'}</p>
            <p>Email: {customerInfo?.email || 'Not provided'}</p>
            <p>Payment Method: {customerInfo?.paymentMethods?.[0]?.type || 'Cash on Delivery'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Coupon Code</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-3 sm:space-y-4">
            <div className="flex gap-2 sm:gap-3">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 h-10 sm:h-12 rounded-2xl border-2 bg-white text-sm sm:text-base"
              />
              <Button 
                onClick={applyCoupon}
                className="h-10 sm:h-12 rounded-2xl px-4 sm:px-8 font-semibold bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white text-xs sm:text-sm shadow-md"
              >
                Apply
              </Button>
            </div>
            {couponError && (
              <p className="text-red-500 text-xs sm:text-sm">{couponError}</p>
            )}
            {appliedVoucher && (
              <p className="text-green-600 text-xs sm:text-sm font-semibold">
                🎉 {appliedVoucher.slogan} - {appliedVoucher.discount}% discount applied!
              </p>
            )}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total (Included GST):</span>
                <span className="text-black">₹{totalAmount}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Added:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-bold text-black">
                <span>Grand Total:</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={async () => {
            try {
              const customerId = localStorage.getItem('customerId');
              if (!customerId) {
                alert('Please login to place order');
                return;
              }
              
              const orderPayload = {
                customerId,
                items: orderData.items || [],
                totalAmount: finalAmount,
                pickupAddress: orderData.address,
                pickupSlot: orderData.selectedSlot,
                pickupDate: orderData.pickupType === 'now' ? new Date() : new Date(Date.now() + 24 * 60 * 60 * 1000),
                paymentMethod: 'Cash on Delivery'
              };
              
              const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
              });
              
              const result = await response.json();
              
              if (result.success) {
                navigate("/booking-confirmation", { 
                  state: {
                    orderId: result.data.orderId,
                    items: itemsText,
                    service: 'Steam Iron',
                    total: finalAmount,
                    originalTotal: totalAmount,
                    discount: discount,
                    appliedVoucher: appliedVoucher,
                    customerInfo: customerInfo,
                    status: 'Pending',
                    pickupType: orderData.pickupType,
                    selectedSlot: orderData.selectedSlot,
                    address: orderData.address
                  }
                });
              } else {
                alert('Failed to place order. Please try again.');
              }
            } catch (error) {
              console.error('Error placing order:', error);
              alert('Failed to place order. Please try again.');
            }
          }}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white shadow-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ContinueBooking;
