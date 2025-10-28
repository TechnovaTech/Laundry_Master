import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, Shirt, Clock, Package, Truck, CheckCircle2, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateInvoicePDF } from "@/utils/generateInvoice";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const orderId = location.state?.orderId;
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      // Refresh every 5 seconds to get latest updates
      const interval = setInterval(fetchOrderDetails, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders`);
      const data = await response.json();
      
      if (data.success) {
        const foundOrder = data.data.find((o: any) => o._id === orderId || o.orderId === orderId);
        console.log('Order data:', foundOrder);
        console.log('reachedLocationAt:', foundOrder?.reachedLocationAt);
        console.log('pickedUpAt:', foundOrder?.pickedUpAt);
        console.log('deliveredToHubAt:', foundOrder?.deliveredToHubAt);
        console.log('hubApprovedAt:', foundOrder?.hubApprovedAt);
        console.log('status:', foundOrder?.status);
        setOrder(foundOrder);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getTimeline = () => {
    if (!order) return [];
    
    const statusMap = {
      'pending': 0,
      'reached_location': 1,
      'picked_up': 2,
      'delivered_to_hub': 3,
      'processing': 4,
      'ironing': 5,
      'process_completed': 6,
      'ready': 4,
      'out_for_delivery': 7,
      'delivered': 8
    };
    
    const currentStep = statusMap[order.status] || 0;
    
    const formatDateTime = (date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + 
             ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };
    
    const placedTime = formatDateTime(order.createdAt);
    const reachedLocationTime = order.reachedLocationAt ? formatDateTime(order.reachedLocationAt) : 'Pending';
    const pickedUpTime = order.pickedUpAt ? formatDateTime(order.pickedUpAt) : 'Pending';
    const deliveredToHubTime = order.deliveredToHubAt ? formatDateTime(order.deliveredToHubAt) : 'Pending';
    const processingTime = order.hubApprovedAt ? formatDateTime(order.hubApprovedAt) : 'Pending';
    const ironingTime = order.ironingAt ? formatDateTime(order.ironingAt) : 'Pending';
    const processCompletedTime = order.processCompletedAt ? formatDateTime(order.processCompletedAt) : 'Pending';
    
    return [
      { icon: Clock, label: 'Order Placed', time: placedTime, completed: currentStep >= 0, active: currentStep === 0 },
      { icon: Package, label: 'Reached Location', time: reachedLocationTime, completed: currentStep >= 1, active: currentStep === 1 },
      { icon: Package, label: 'Picked Up', time: pickedUpTime, completed: currentStep >= 2, active: currentStep === 2 },
      { icon: Truck, label: 'Delivered to Hub', time: deliveredToHubTime, completed: currentStep >= 3, active: currentStep === 3 },
      { icon: Shirt, label: 'Processing', time: processingTime, completed: currentStep >= 4, active: currentStep === 4 },
      { icon: Shirt, label: 'Ironing', time: ironingTime, completed: currentStep >= 5, active: currentStep === 5 },
      { icon: CheckCircle2, label: 'Process Completed', time: processCompletedTime, completed: currentStep >= 6, active: currentStep === 6 },
      { icon: Truck, label: 'Out for Delivery', time: order.outForDeliveryAt ? formatDateTime(order.outForDeliveryAt) : 'Pending', completed: currentStep >= 7, active: currentStep === 7 },
      { icon: CheckCircle2, label: 'Delivered', time: order.deliveredAt ? formatDateTime(order.deliveredAt) : 'Pending', completed: currentStep >= 8, active: currentStep === 8 },
    ];
  };
  
  const timeline = getTimeline();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 px-4 sm:px-6 py-4 flex items-center justify-between z-10 shadow-lg" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center mx-4 text-white">Track Order</h1>
        <button className="flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading order details...
          </div>
        ) : !order ? (
          <div className="text-center py-8 text-gray-500">
            Order not found
          </div>
        ) : (
          <>
        <Card className="p-3 sm:p-4 rounded-2xl border-2 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
                <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base">Order #{order?.orderId || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {order?.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items'}
                </p>
                <p className="text-base sm:text-lg font-bold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{order?.totalAmount || 0}</p>
              </div>
            </div>
            <span className="px-2 sm:px-4 py-1 sm:py-1.5 text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
              {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ') : 'Unknown'}
            </span>
          </div>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    item.completed ? "" : "bg-muted"
                  }`}
                  style={item.completed ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : {}}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      item.completed ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      item.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                    style={item.active ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="p-3 sm:p-4 rounded-2xl border-2 shadow-md" style={{ background: 'linear-gradient(to bottom right, #f0ebf8, #e0f7fa)' }}>
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            Pickup Address: {order?.pickupAddress ? `${order.pickupAddress.street}, ${order.pickupAddress.city}` : 'Not specified'}
          </p>
          <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1">
            Pickup Slot: {order?.pickupSlot?.timeSlot || 'Not scheduled'}
          </p>
        </Card>

        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm border-2 shadow-md" style={{ borderColor: '#452D9B', color: '#452D9B' }}>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Contact Partner
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg"
            onClick={() => setShowIssueForm(true)}
          >
            ⚠ Report Issue
          </Button>
        </div>

        {showIssueForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Report Issue</h2>
              <textarea
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full border rounded-lg p-3 min-h-32 mb-4 outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-2"
                  onClick={() => {
                    setShowIssueForm(false);
                    setIssueText('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 shadow-lg text-white"
                  style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                  onClick={async () => {
                    if (!issueText.trim()) {
                      alert('Please describe the issue');
                      return;
                    }
                    console.log('Reporting issue for order:', order._id);
                    console.log('Issue text:', issueText);
                    const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        issue: issueText,
                        issueReportedAt: new Date().toISOString()
                      })
                    });
                    const result = await response.json();
                    console.log('Response:', result);
                    if (response.ok) {
                      setShowIssueForm(false);
                      setIssueText('');
                      setShowSuccessToast(true);
                      setTimeout(() => setShowSuccessToast(false), 3000);
                      fetchOrderDetails();
                    } else {
                      alert('Failed to report issue: ' + (result.message || 'Unknown error'));
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={() => generateInvoicePDF(order)}
          className="w-full h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base text-white shadow-lg"
          style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Download Invoice
        </Button>
          </>
        )}
      </div>

      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <span className="font-semibold flex-1">Issue reported successfully!</span>
            <button onClick={() => setShowSuccessToast(false)} className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
