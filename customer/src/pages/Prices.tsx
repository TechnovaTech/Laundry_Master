import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Shirt, Bed, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import { useEffect, useState } from "react";

const Prices = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pricing');
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Men', 'Women', 'Household'];
  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const groupedItems = filteredItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});



  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white flex-1 text-center mx-4">Prices</h1>
        <button className="flex-shrink-0">
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {['Men', 'Women', 'Household'].map((cat) => {
            const Icon = cat === 'Household' ? Bed : Shirt;
            return (
              <div key={cat} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-bold text-sm sm:text-lg mb-1 text-black">{cat}</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {items.filter(item => item.category === cat).length} items
                </p>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading prices...</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-lg">
            <p className="text-center text-sm text-gray-600">No pricing items available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {['Men', 'Women', 'Household'].map((category) => {
              const categoryItems = items.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category}>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {category}
                  </h2>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {categoryItems.map((item: any, index: number) => (
                      <div
                        key={item._id}
                        className={`flex items-center justify-between p-4 ${
                          index !== categoryItems.length - 1 ? 'border-b border-gray-100' : ''
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                            <Shirt className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </div>
                        <span className="text-lg font-bold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 rounded-2xl p-4 shadow-md" style={{ background: 'linear-gradient(to bottom right, #f0ebf8, #e0f7f9)' }}>
          <p className="text-center text-xs text-gray-700 font-medium">
            *All services include professional steam ironing as standard.
          </p>
        </div>
      </div>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#452D9B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#07C8D0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl border-t">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" style={{ stroke: 'url(#gradient)' }} />
        </button>
        <button onClick={() => navigate("/booking")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-shadow" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default Prices;
