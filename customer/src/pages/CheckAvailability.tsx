import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import checkAvailabilityImg from "@/assets/Pincode availablity screen.png";

const CheckAvailability = () => {
  const navigate = useNavigate();
  const [pincode, setPincode] = useState("");

  const handleCheckAvailability = async () => {
    try {
      console.log('Checking pincode:', pincode)
      const response = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${pincode}`)
      const data = await response.json()
      console.log('API response:', data)
      
      if (data.serviceable) {
        navigate("/congrats")
      } else {
        navigate("/not-available")
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      navigate("/not-available")
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-bold text-center">Check Availability</h1>
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <img 
          src={checkAvailabilityImg}
          alt="Check Availability" 
          className="mb-4 sm:mb-6 w-72 h-72 sm:w-96 sm:h-96 object-contain"
        />
        
        <p className="mb-4 sm:mb-6 text-center text-muted-foreground font-semibold text-sm sm:text-base px-4">
          Enter your area pincode to check<br />service availability
        </p>
        
        <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
          <Input
            type="number"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className="rounded-xl border-input py-4 sm:py-6 text-center text-base sm:text-lg"
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          
          <Button 
            onClick={handleCheckAvailability}
            disabled={pincode.length !== 6}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-6 sm:py-8 text-base sm:text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckAvailability;
