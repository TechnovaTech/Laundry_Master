import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import congratsImg from "@/assets/Congrats we are available.png";

const Congrats = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-6 overflow-hidden">
      <div className="flex w-full max-w-sm sm:max-w-md flex-col items-center text-center">
        <img 
          src={congratsImg}
          alt="Congrats" 
          className="mb-6 sm:mb-8 w-72 h-72 sm:w-96 sm:h-96 object-contain"
        />
        
        <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold text-primary">
          Congrats!
        </h1>
        
        <p className="mb-6 sm:mb-8 text-sm sm:text-base text-foreground px-2 sm:px-4">
          Our Steam Ironing Service is available in your area. Let's get started with fresh, crisp clothes.
        </p>
        
        <div className="w-full space-y-3 sm:space-y-4">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg"
            size="lg"
          >
            Continue to Signup
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/services")}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg"
            size="lg"
          >
            Browse Services
          </Button>
        </div>
        
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
          Not your location?
          <button 
            onClick={() => navigate("/check-availability")}
            className="ml-1 font-semibold text-primary hover:underline"
          >
            Change Pincode
          </button>
        </p>
      </div>
    </div>
  );
};

export default Congrats;
