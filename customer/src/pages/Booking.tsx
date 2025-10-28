import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Shirt, MapPin, CheckCircle2, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User, Minus, Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const [pickupType, setPickupType] = useState<"now" | "later">("now");
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showSlotError, setShowSlotError] = useState(false);
  const [customerAddress, setCustomerAddress] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  useEffect(() => {
    fetchPricingItems();
    fetchTimeSlots();
    fetchCustomerAddress();
  }, []);
  
  const fetchPricingItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pricing');
      const data = await response.json();
      if (data.success) {
        setPricingItems(data.data);
        // Initialize quantities
        const initialQuantities: {[key: string]: number} = {};
        data.data.forEach((item: PricingItem) => {
          initialQuantities[item._id] = 0;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Failed to fetch pricing items:', error);
    }
  };
  
  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/time-slots');
      const data = await response.json();
      if (data.success) {
        setTimeSlots(data.data);
        // Set first available slot as default
        const availableSlots = getAvailableSlots(data.data);
        if (availableSlots.length > 0) {
          setSelectedSlot(availableSlots[0].time);
        }
      }
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    }
  };
  
  const isSlotPassed = (slotTime: string) => {
    if (pickupType === 'later') return false; // Tomorrow slots are always available
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Extract end time from slot (e.g., "7-8 AM" -> 8, "2-4 PM" -> 16)
    const timeMatch = slotTime.match(/(\d+)-(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return false;
    
    const endHour = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    
    let slotEndHour = endHour;
    if (period === 'PM' && endHour !== 12) {
      slotEndHour = endHour + 12;
    } else if (period === 'AM' && endHour === 12) {
      slotEndHour = 0;
    }
    
    return currentHour >= slotEndHour;
  };
  
  const getAvailableSlots = (slots: any[]) => {
    return slots.filter(slot => !isSlotPassed(slot.time));
  };
  
  const handleSlotSelection = (slotTime: string) => {
    if (isSlotPassed(slotTime)) {
      setShowSlotError(true);
      setTimeout(() => setShowSlotError(false), 3000);
      return;
    }
    setSelectedSlot(slotTime);
  };

  const updateQuantity = (itemId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + (increment ? 1 : -1))
    }));
  };
  
  const calculateTotal = () => {
    return pricingItems.reduce((total, item) => {
      return total + (item.price * (quantities[item._id] || 0));
    }, 0);
  };
  
  const fetchCustomerAddress = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data?.address) {
        setSavedAddresses(data.data.address);
        const primaryAddress = data.data.address.find((addr: any) => addr.isDefault) || data.data.address[0];
        setCustomerAddress(primaryAddress);
      }
    } catch (error) {
      console.error('Failed to fetch customer address:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#452D9B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#07C8D0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      <header className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black flex-1 text-center mx-4 truncate">Book Your Order</h1>
        <button className="flex-shrink-0">
          <Info className="w-5 h-5 sm:w-6 sm:h-6" style={{ stroke: 'url(#gradient)' }} />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Clothes Quantity</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-3 sm:space-y-4">
            {pricingItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                    <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black text-sm sm:text-base">
                      {item.name} <span style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{item.price}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item._id, false)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-white flex items-center justify-center font-bold touch-manipulation shadow-md"
                    style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-6 sm:w-8 text-center font-semibold text-black text-sm sm:text-base">
                    {quantities[item._id] || 0}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-white flex items-center justify-center font-bold touch-manipulation shadow-md"
                    style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Select Pickup</h2>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => setPickupType("now")}
              className={`flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base shadow-md ${
                pickupType === "now" 
                  ? "text-white" 
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
              style={pickupType === "now" ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { color: '#452D9B' }}
            >
              Pickup Now
            </Button>
            <Button
              onClick={() => setPickupType("later")}
              className={`flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base shadow-md ${
                pickupType === "later" 
                  ? "text-white" 
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
              style={pickupType === "later" ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { color: '#452D9B' }}
            >
              Pickup Later
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Schedule Pickup & Delivery</h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button className="h-10 sm:h-12 rounded-2xl font-semibold whitespace-nowrap text-white text-sm sm:text-base px-3 sm:px-4 flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
              {pickupType === "now" ? "Today" : "Tomorrow"}
            </Button>
            {timeSlots.map((slot) => (
              <Button 
                key={slot._id}
                onClick={() => handleSlotSelection(slot.time)}
                className={`h-10 sm:h-12 rounded-2xl font-semibold whitespace-nowrap text-sm sm:text-base px-3 sm:px-4 flex-shrink-0 ${
                  isSlotPassed(slot.time) && pickupType === 'now'
                    ? 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed'
                    : selectedSlot === slot.time 
                      ? 'text-white shadow-md' 
                      : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                }`}
                style={selectedSlot === slot.time && !(isSlotPassed(slot.time) && pickupType === 'now') ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : {}}
              >
                {slot.time}
              </Button>
            ))}
          </div>
          <p className="text-xs sm:text-sm mt-2 sm:mt-3" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Next available slot: {pickupType === "now" ? "Today" : "Tomorrow"}, {selectedSlot || 'No slots available'}
          </p>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Pickup & Delivery Address</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ stroke: 'url(#gradient)' }} />
                <div className="min-w-0">
                  {customerAddress ? (
                    <>
                      <p className="font-semibold text-black text-sm sm:text-base">{customerAddress.street},</p>
                      <p className="font-semibold text-black text-sm sm:text-base">{customerAddress.city}, {customerAddress.state} - {customerAddress.pincode}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-black text-sm sm:text-base">No address found</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Please add an address</p>
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={() => savedAddresses.length > 0 ? setShowAddressModal(true) : navigate("/add-address")}
                className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {savedAddresses.length > 0 ? 'Change' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowAddressModal(false)}>
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-bold text-black mb-4">Select Address</h3>
                <div className="space-y-3">
                  {savedAddresses.map((addr, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setCustomerAddress(addr);
                        setShowAddressModal(false);
                      }}
                      className="p-4 rounded-2xl border-2 cursor-pointer"
                      style={customerAddress?.street === addr.street && customerAddress?.city === addr.city ? { borderColor: '#452D9B', backgroundColor: '#f0ebf8' } : { borderColor: '#e5e7eb' }}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ stroke: 'url(#gradient)' }} />
                        <div className="flex-1">
                          <p className="font-semibold text-black text-sm">{addr.street}</p>
                          <p className="text-gray-600 text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                          {addr.isDefault && <span className="text-xs font-medium" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Primary</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      navigate("/add-address");
                    }}
                    className="w-full py-3 border-2 border-dashed rounded-2xl font-semibold"
                    style={{ borderColor: '#9b7dd4', background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                  >
                    + Add New Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Order Summary</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-black">
              Items: {pricingItems.filter(item => (quantities[item._id] || 0) > 0).map(item => `${quantities[item._id]} ${item.name}`).join(', ') || 'No items selected'}
            </p>
            <p className="text-xs sm:text-sm text-black">Service: Steam Iron</p>
            <p className="text-xs sm:text-sm text-black font-semibold">Minimum Order Value: ₹500</p>
            <div className="border-t pt-2 sm:pt-3">
              <p className="text-base sm:text-lg font-bold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Estimated Total: ₹{calculateTotal()}</p>
              {calculateTotal() < 500 && (
                <p className="text-xs text-red-500 mt-1 sm:mt-2 font-semibold">⚠ Minimum order value of ₹500 required</p>
              )}
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Payment will be collected upon delivery</p>
            </div>
          </div>
        </div>

        {showSlotError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 animate-pulse">
            <p className="text-red-700 text-sm sm:text-base font-medium text-center">
              ⏰ This time slot has passed. Please select another slot.
            </p>
          </div>
        )}
        
        <Button
          onClick={() => {
            if (!customerAddress) {
              setToast({ show: true, message: 'Please select a delivery address', type: 'error' });
              setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
              return;
            }
            const orderData = {
              items: pricingItems
                .filter(item => (quantities[item._id] || 0) > 0)
                .map(item => ({
                  name: item.name,
                  quantity: quantities[item._id],
                  price: item.price
                })),
              total: calculateTotal(),
              pickupType,
              selectedSlot,
              address: customerAddress
            };
            navigate("/continue-booking", { state: orderData });
          }}
          disabled={calculateTotal() < 500}
          className={`w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold transition-colors shadow-lg ${
            calculateTotal() < 500 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Confirm Order
        </Button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-white shadow-lg" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>

      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`${toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-semibold flex-1">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: '' })} className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
