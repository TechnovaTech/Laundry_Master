import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail, Phone, Plus } from "lucide-react";

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const mobileNumber = location.state?.mobileNumber;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    referralCode: ''
  });

  useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId')
    const storedMobile = localStorage.getItem('userMobile')
    
    if (!customerId && !storedCustomerId) {
      navigate('/login')
      return
    }
    
    const actualCustomerId = customerId || storedCustomerId
    const actualMobile = mobileNumber || storedMobile
    
    if (actualMobile) {
      setFormData(prev => ({ ...prev, phone: actualMobile }))
    }
    
    // Fetch existing customer data
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${actualCustomerId}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          const customer = data.data
          setFormData({
            fullName: customer.name || '',
            email: customer.email || '',
            phone: customer.mobile || actualMobile || ''
          })
        }
      } catch (error) {
        console.log('No existing customer data found')
      }
    }
    
    if (actualCustomerId) {
      fetchCustomerData()
    }
  }, [customerId, mobileNumber, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          mobile: formData.phone,
          referralCode: formData.referralCode || undefined
        })
      })
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('customerId', customerId)
        localStorage.setItem('userName', formData.fullName)
        window.dispatchEvent(new Event('userNameChanged'))
        navigate("/home")
      } else {
        console.error('Profile save failed:', data.error)
        alert('Failed to save profile: ' + data.error)
      }
    } catch (error) {
      console.error('Profile save failed:', error)
      alert('Failed to save profile')
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white flex items-center border-b px-4 sm:px-6 py-4 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 sm:mr-4 flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black">Create Profile</h1>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profile-image"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" strokeWidth={3} />
              )}
            </label>
          </div>
          <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm">Add Profile Photo</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
              className="h-10 sm:h-12 rounded-xl border-2 border-gray-300 text-sm sm:text-base"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!formData.fullName || !formData.email || !formData.phone}
          className="w-full h-10 sm:h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold mt-4 sm:mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default CreateProfile;