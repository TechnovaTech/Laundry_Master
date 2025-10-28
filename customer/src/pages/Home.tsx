import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import homeScreenImage from "@/assets/Home screen.png";

const Home = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('Sagnik');
  const [currentVoucher, setCurrentVoucher] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [customerAddress, setCustomerAddress] = useState('No address added yet');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [heroItems, setHeroItems] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }

    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('userName');
      if (updatedName) {
        setUserName(updatedName);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userNameChanged', handleStorageChange);

    fetchVouchers();
    fetchCustomerAddress();
    fetchRecentOrders();
    fetchHeroItems();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userNameChanged', handleStorageChange);
    };
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/vouchers');
      const data = await response.json();
      if (data.success) {
        setVouchers(data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };
  
  const fetchCustomerAddress = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data?.address?.[0]) {
        const address = data.data.address[0];
        const addressText = `${address.street || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`;
        setCustomerAddress(addressText.replace(/^, |, $/, ''));
      }
    } catch (error) {
      console.error('Error fetching customer address:', error);
    }
  };
  
  const fetchRecentOrders = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/orders?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        // Get only the 3 most recent orders
        setRecentOrders(data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };
  
  const fetchHeroItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/hero-section');
      const data = await response.json();
      if (data.success) {
        setHeroItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching hero items:', error);
    }
  };
  
  // Auto-scroll hero items
  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroItems.length]);
  
  // Auto-scroll vouchers only if not manually controlled
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentVoucher(prev => (prev + 1) % vouchers.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [vouchers.length, isAutoScrolling]);
  
  // Scroll to current voucher only during auto-scroll
  useEffect(() => {
    if (scrollRef.current && isAutoScrolling) {
      const scrollWidth = scrollRef.current.scrollWidth / vouchers.length;
      scrollRef.current.scrollTo({
        left: currentVoucher * scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [currentVoucher, vouchers.length, isAutoScrolling]);
  
  // Handle manual scroll
  const handleScroll = () => {
    if (!scrollRef.current || isAutoScrolling) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.scrollWidth / vouchers.length;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== currentVoucher) {
      setCurrentVoucher(newIndex);
    }
  };
  
  // Detect manual interaction
  const handleTouchStart = () => {
    setIsAutoScrolling(false);
  };
  
  // Resume auto-scroll after 5 seconds of no interaction
  useEffect(() => {
    if (!isAutoScrolling) {
      const timeout = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isAutoScrolling]);

  const handleApplyVoucher = (voucherCode: string) => {
    setSelectedVoucherCode(voucherCode);
    setShowVoucherModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedVoucherCode);
    setIsCopied(true);
    setClaimedVouchers(prev => [...prev, selectedVoucherCode]);
  };

  const closeModal = () => {
    setShowVoucherModal(false);
    setSelectedVoucherCode('');
    setIsCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      {/* Gradient Header Section */}
      <div className="text-white px-4 sm:px-6 py-6 sm:py-8 shadow-xl" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hi, {userName} 👋</h1>
            <p className="text-white/90 text-sm sm:text-base">Let's schedule your order</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Hero Carousel */}
        {heroItems.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              {heroItems.map((item: any, index) => (
                <div
                  key={item._id}
                  className="transition-opacity duration-500 relative"
                  style={{
                    display: index === currentHero ? 'block' : 'none',
                    opacity: index === currentHero ? 1 : 0
                  }}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt="Hero"
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                  ) : !videoErrors.has(item._id) ? (
                    <video
                      src={item.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-48 sm:h-64 object-cover"
                      onError={() => setVideoErrors(prev => new Set(prev).add(item._id))}
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <p className="text-white text-sm">Video unavailable</p>
                    </div>
                  )}
                  {(item.title || item.description || item.buttonText) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                      {item.title && <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{item.title}</h3>}
                      {item.description && <p className="text-white/90 text-sm sm:text-base mb-2">{item.description}</p>}
                      {item.buttonText && item.buttonLink && (
                        <button
                          onClick={() => navigate(item.buttonLink)}
                          className="bg-gradient-to-r from-[#452D9B] to-[#07C8D0] text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          {item.buttonText}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {heroItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentHero ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Book Order Button */}
        <Button
          onClick={() => navigate("/booking")}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl text-sm sm:text-base font-semibold mb-4 sm:mb-6 shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Book Your Order
        </Button>

        {/* Next Slot Info */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-lg border border-gray-100">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-xs sm:text-sm mb-1">Next available slot</p>
              <p className="text-black font-bold text-base sm:text-lg">Tomorrow, 9-11 AM</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 mb-3 sm:mb-4">
            <p className="text-gray-600 text-xs sm:text-sm font-medium break-words">📍 {customerAddress}</p>
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 bg-gray-50 rounded-xl py-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] text-white flex items-center justify-center font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-black text-2xl sm:text-3xl font-bold w-12 sm:w-16 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] text-white flex items-center justify-center font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Offer Cards - Horizontal Scroll */}
        <div className="mb-4 sm:mb-6">
          <div 
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onMouseDown={handleTouchStart}
          >
            {vouchers.map((voucher: any, index) => (
              <div key={voucher._id} className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 shadow-lg flex-shrink-0 w-72 snap-center border border-blue-300">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">LIMITED</span>
                  </div>
                  <h3 className="font-bold text-base mb-1 text-blue-900">{voucher.slogan}</h3>
                  <p className="text-blue-700 text-sm mb-3">Limited time offer</p>
                  <Button 
                    onClick={() => !claimedVouchers.includes(voucher.code) && handleApplyVoucher(voucher.code)}
                    className={`w-full h-9 rounded-xl text-sm font-semibold shadow-md ${
                      claimedVouchers.includes(voucher.code)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white'
                    }`}
                  >
                    {claimedVouchers.includes(voucher.code) ? '✓ Claimed' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {vouchers.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentVoucher ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            Recent Orders
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                  <span className="font-bold text-blue-600 text-sm sm:text-base">Order #{order.orderId}</span>
                  <Button
                    onClick={() => navigate("/order-details", { state: { orderId: order.orderId } })}
                    className="h-9 sm:h-10 bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0 shadow-md px-4"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Reorder
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#452D9B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#07C8D0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" style={{ stroke: 'url(#gradient)' }} />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white shadow-lg">
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

      {/* Voucher Code Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg font-bold text-black mb-4">Your Voucher Code</h3>
              
              <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-4 mb-4">
                <p className="text-2xl font-bold text-blue-600 tracking-wider mb-2">{selectedVoucherCode}</p>
                <button 
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              
              <div className="text-left space-y-2 mb-6">
                <p className="text-sm text-gray-700">• It is one time use, so please copy it</p>
                <p className="text-sm text-gray-700">• Use it while you order</p>
              </div>
              
              <button 
                onClick={closeModal}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-2xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;