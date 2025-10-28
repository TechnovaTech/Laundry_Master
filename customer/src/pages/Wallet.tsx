import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Share2, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const navigate = useNavigate();
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [pointsPerRupee, setPointsPerRupee] = useState(2);
  const [minRedeemPoints, setMinRedeemPoints] = useState(100);
  const [referralPoints, setReferralPoints] = useState(50);

  const [walletData, setWalletData] = useState({
    availableBalance: 0,
    points: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastAction, setToastAction] = useState('');

  useEffect(() => {
    fetchWalletSettings();
    fetchCustomerWallet();
    fetchWalletTransactions();
  }, []);

  const fetchCustomerWallet = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('Customer data:', data.data);
        setWalletData({
          availableBalance: data.data.walletBalance || 0,
          points: data.data.loyaltyPoints || 0
        });
        
        console.log('lastAdjustmentReason:', data.data.lastAdjustmentReason);
        console.log('lastAdjustmentAt:', data.data.lastAdjustmentAt);
        console.log('lastAdjustmentAction:', data.data.lastAdjustmentAction);
        
        if (data.data.lastAdjustmentReason && data.data.lastAdjustmentAt) {
          const adjustmentTime = new Date(data.data.lastAdjustmentAt).getTime();
          const now = new Date().getTime();
          const timeDiff = now - adjustmentTime;
          
          console.log('Time diff (ms):', timeDiff);
          console.log('Time diff (hours):', timeDiff / 3600000);
          
          if (timeDiff < 86400000) {
            console.log('Showing toast notification');
            setToastMessage(data.data.lastAdjustmentReason);
            setToastAction(data.data.lastAdjustmentAction || 'increase');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 30000);
          } else {
            console.log('Adjustment too old, not showing notification');
          }
        } else {
          console.log('No adjustment data found');
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const fetchWalletSettings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/wallet-settings');
      const data = await response.json();
      console.log('Wallet settings fetched:', data);
      if (data.success) {
        setPointsPerRupee(data.data.pointsPerRupee);
        setMinRedeemPoints(data.data.minRedeemPoints);
        setReferralPoints(data.data.referralPoints);
        console.log('Points per rupee set to:', data.data.pointsPerRupee);
      }
    } catch (error) {
      console.error('Failed to fetch wallet settings:', error);
    }
  };

  const [walletHistory, setWalletHistory] = useState([]);

  const fetchWalletTransactions = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      console.log('Fetching transactions for customer:', customerId);
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/wallet-transactions?customerId=${customerId}`);
      const data = await response.json();
      console.log('Transactions response:', data);
      
      if (data.success && data.data) {
        console.log('Raw transactions:', data.data);
        const formattedTransactions = data.data.map((t: any) => ({
          id: t._id,
          title: `${t.type === 'balance' ? 'Balance' : 'Points'} ${t.action === 'increase' ? 'Added' : 'Deducted'}`,
          subtitle: t.reason,
          amount: `${t.action === 'increase' ? '+' : '-'}${t.type === 'balance' ? '₹' : ''}${t.amount}${t.type === 'points' ? ' pts' : ''}`,
          type: t.action === 'increase' ? 'credit' : 'debit',
          date: new Date(t.createdAt).toLocaleDateString()
        }));
        console.log('Formatted transactions:', formattedTransactions);
        setWalletHistory(formattedTransactions);
      } else {
        console.log('No transactions found or error:', data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleUsePoints = async () => {
    if (walletData.points < minRedeemPoints) {
      alert(`Insufficient points! You need at least ${minRedeemPoints} points to redeem.`);
      return;
    }
    if (walletData.points >= minRedeemPoints) {
      const cashValue = Math.floor(100 / pointsPerRupee);
      const newPoints = walletData.points - 100;
      const newBalance = walletData.availableBalance + cashValue;
      
      await updateWalletInDB(newBalance, newPoints, 100, cashValue);
      
      setWalletData({
        points: newPoints,
        availableBalance: newBalance
      });
      
      fetchWalletTransactions();
    }
  };

  const updateWalletInDB = async (balance: number, points: number, pointsRedeemed: number, cashValue: number) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletBalance: balance,
          loyaltyPoints: points
        })
      });
      
      if (response.ok) {
        await fetch(`http://localhost:3000/api/customers/${customerId}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'points',
            action: 'decrease',
            amount: pointsRedeemed,
            reason: `Redeemed ${pointsRedeemed} points for ₹${cashValue}`
          })
        });
        
        await fetch(`http://localhost:3000/api/customers/${customerId}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'balance',
            action: 'increase',
            amount: cashValue,
            reason: `Redeemed ${pointsRedeemed} points`
          })
        });
        
        await fetchCustomerWallet();
      }
    } catch (error) {
      console.error('Failed to update wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-4 flex items-center shadow-lg">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold ml-4 text-white">Wallet</h1>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 sm:p-8 shadow-lg text-center border-2 border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Available Balance:</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">₹{walletData.availableBalance}</p>
          <p className="text-gray-700 mb-4 text-sm sm:text-base font-medium">You have {walletData.points} points ({pointsPerRupee} points = ₹1)</p>
          <Button 
            onClick={handleUsePoints}
            disabled={walletData.points < minRedeemPoints}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-white text-base shadow-lg"
            style={walletData.points >= minRedeemPoints ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af', cursor: 'not-allowed' }}
          >
            Use {minRedeemPoints} Points {walletData.points < minRedeemPoints ? `(Need ${minRedeemPoints - walletData.points} more)` : ''}
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Redeem Points</h2>
          <div className="mb-4">
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max={walletData.points}
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(redeemPoints / walletData.points) * 100}%, #e5e7eb ${(redeemPoints / walletData.points) * 100}%, #e5e7eb 100%)`
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: none;
                }
              `}</style>
            </div>
            <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">{redeemPoints} Points = ₹{Math.floor(redeemPoints / pointsPerRupee)}</p>
          </div>
          <Button 
            onClick={async () => {
              if (redeemPoints < minRedeemPoints) {
                alert(`Minimum ${minRedeemPoints} points required to redeem!`);
                return;
              }
              if (walletData.points >= redeemPoints && redeemPoints > 0) {
                const cashValue = Math.floor(redeemPoints / pointsPerRupee);
                const newPoints = walletData.points - redeemPoints;
                const newBalance = walletData.availableBalance + cashValue;
                
                await updateWalletInDB(newBalance, newPoints, redeemPoints, cashValue);
                
                setWalletData({
                  points: newPoints,
                  availableBalance: newBalance
                });
                
                fetchWalletTransactions();
                setRedeemPoints(0);
              }
            }}
            disabled={redeemPoints < minRedeemPoints || walletData.points < redeemPoints}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-white text-base shadow-lg"
            style={redeemPoints >= minRedeemPoints && walletData.points >= redeemPoints ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af', cursor: 'not-allowed' }}
          >
            Redeem Now {redeemPoints < minRedeemPoints ? `(Min ${minRedeemPoints} points)` : walletData.points < redeemPoints ? '(Insufficient)' : ''}
          </Button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Wallet History (Last 5)</h2>
          <div className="space-y-3">
            {walletHistory.slice(0, 5).map((transaction) => {
              const isOrderTransaction = transaction.title.includes('Order #');
              const orderId = isOrderTransaction ? transaction.title.match(/#(\d+)/)?.[1] : null;
              
              const TransactionComponent = isOrderTransaction ? 'button' : 'div';
              
              return (
                <TransactionComponent 
                  key={transaction.id} 
                  className={`w-full bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow ${
                    isOrderTransaction ? 'cursor-pointer' : ''
                  }`}
                  onClick={isOrderTransaction && orderId ? () => navigate(`/rate-order/${orderId}`) : undefined}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-black text-sm sm:text-base truncate text-left">{transaction.title}</p>
                      <p className="text-sm text-gray-500 text-left">{transaction.subtitle}</p>
                    </div>
                    <span className={`font-bold text-lg sm:text-xl flex-shrink-0 ${
                      transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount}
                    </span>
                  </div>
                </TransactionComponent>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between gap-4 border-2 border-green-200 hover:shadow-xl transition-shadow">
          <p className="text-gray-800 text-sm sm:text-base flex-1 font-medium">Earn {referralPoints} points for every friend you invite.</p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex-shrink-0">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl border-t">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/booking")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-shadow">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
        </button>
      </nav>

      {showToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toastAction === 'increase' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxWidth: '90%',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.5rem' }}>{toastAction === 'increase' ? '🎉' : '😢'}</span>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0 0.25rem'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;