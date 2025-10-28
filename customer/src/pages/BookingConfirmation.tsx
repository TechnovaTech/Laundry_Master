import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  
  const orderId = orderData.orderId || 12345;
  const items = orderData.items || '3 Shirts, 1 Bedsheet';
  const service = orderData.service || 'Steam Iron';
  const total = orderData.total || 150;
  const status = orderData.status || 'Scheduled';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold ml-3 sm:ml-4">Order Confirmed</h1>
      </header>

      <div className="px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Your booking is<br />confirmed!
        </h1>
        
        <p className="text-center text-muted-foreground mb-1 text-sm sm:text-base">
          Order #{orderId} has been placed successfully.
        </p>
        <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
          Pickup scheduled for {orderData.pickupType === 'now' ? 'Today' : 'Tomorrow'}, {orderData.selectedSlot || '9-11 AM'}.
        </p>

        <Card className="w-full p-4 sm:p-6 rounded-2xl border-2 mb-4 sm:mb-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Items:</span>
              <span className="font-semibold text-sm sm:text-base text-right">{items}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Service:</span>
              <span className="font-semibold text-sm sm:text-base">{service}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Price:</span>
              <span className="font-bold text-primary text-base sm:text-lg">₹{total}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Status:</span>
              <span className="font-semibold text-primary text-sm sm:text-base">{status}</span>
            </div>
            {orderData.discount > 0 && (
              <div className="flex justify-between items-start gap-3">
                <span className="text-muted-foreground text-sm sm:text-base">Discount:</span>
                <span className="font-semibold text-green-600 text-sm sm:text-base">-₹{orderData.discount}</span>
              </div>
            )}
          </div>
        </Card>

        <Button
          onClick={() => navigate("/order-details", { state: orderData })}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold mb-3 text-white shadow-lg"
          style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Track Order
        </Button>

        <Button
          onClick={() => navigate("/home")}
          variant="outline"
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold mb-4 sm:mb-6 border-2"
          style={{ borderColor: '#452D9B', color: '#452D9B' }}
        >
          Back to Home
        </Button>

        <button className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition px-4 text-center">
          <span>Invite friends & get 20% off your next order.</span>
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
