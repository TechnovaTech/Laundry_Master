import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import notAvailableImg from "@/assets/Sorry not available.png";

const NotAvailable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex w-full max-w-xs sm:max-w-md flex-col items-center text-center">
        <img 
          src={notAvailableImg}
          alt="Not Available" 
          className="mb-6 sm:mb-8 w-72 h-72 sm:w-96 sm:h-96 object-contain"
        />
        
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-foreground">
          Sorry, we're not<br />here yet
        </h1>
        
        <p className="mb-8 sm:mb-12 text-sm sm:text-base text-muted-foreground px-2 sm:px-4">
          We are expanding fast! Enter your details and we'll notify you when we arrive.
        </p>
        
        <div className="w-full space-y-4 sm:space-y-6">
          <Button 
            onClick={() => navigate("/check-availability")}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg"
            size="lg"
          >
            Change Pincode
          </Button>
          
          <button 
            onClick={() => navigate("/")}
            className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAvailable;
