import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapApp } from '@capacitor/app';
import Welcome from "./pages/Welcome";
import CheckAvailability from "./pages/CheckAvailability";
import Congrats from "./pages/Congrats";
import NotAvailable from "./pages/NotAvailable";
import Login from "./pages/Login";
import VerifyMobile from "./pages/VerifyMobile";
import Services from "./pages/Services";
import CreateProfile from "./pages/CreateProfile";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
import Booking from "./pages/Booking";
import ContinueBooking from "./pages/ContinueBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import AddAddress from "./pages/AddAddress";
import Wallet from "./pages/Wallet";
import ReferEarn from "./pages/ReferEarn";
import RateOrder from "./pages/RateOrder";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const backButtonListener = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          navigate(-1);
        } else {
          CapApp.exitApp();
        }
      });

      return () => {
        backButtonListener.remove();
      };
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/check-availability" element={<CheckAvailability />} />
      <Route path="/congrats" element={<Congrats />} />
      <Route path="/not-available" element={<NotAvailable />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-mobile" element={<VerifyMobile />} />
      <Route path="/services" element={<Services />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/prices" element={<Prices />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/continue-booking" element={<ContinueBooking />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/booking-history" element={<BookingHistory />} />
      <Route path="/order-details" element={<OrderDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-address" element={<AddAddress />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/refer-earn" element={<ReferEarn />} />
      <Route path="/rate-order/:orderId" element={<RateOrder />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await SplashScreen.hide();
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          
          Keyboard.addListener('keyboardWillShow', () => {
            document.body.classList.add('keyboard-open');
          });
          
          Keyboard.addListener('keyboardWillHide', () => {
            document.body.classList.remove('keyboard-open');
          });
        } catch (error) {
          console.log('Capacitor initialization error:', error);
        }
      }
    };
    
    initializeApp();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
