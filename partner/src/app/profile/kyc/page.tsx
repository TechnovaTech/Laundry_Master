"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KYCVerification() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    aadharImage: "",
    drivingLicenseNumber: "",
    drivingLicenseImage: ""
  });
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    const partnerToken = localStorage.getItem("partnerToken");
    
    if (!partnerId || !partnerToken) {
      router.push("/login");
      return;
    }
    
    // Fetch partner data from API
    fetchPartnerData(partnerId);
  }, []);
  
  const fetchPartnerData = async (partnerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const result = await response.json();
      if (result.success) {
        setPartner(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch partner data:', error);
    }
  };
  
  useEffect(() => {
    
    if (!partner) return;
    
    // Check if KYC is already submitted
    if (partner.kycStatus && partner.kycStatus !== 'pending') {
      setIsSubmitted(true);
    }

    // Poll for KYC status updates every 5 seconds
    const interval = setInterval(async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (partnerId) {
        fetchPartnerData(partnerId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, [field]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.vehicleType || !formData.vehicleNumber || !formData.aadharNumber || !formData.drivingLicenseNumber) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const partnerId = localStorage.getItem("partnerId");

      const response = await fetch(`http://localhost:3000/api/mobile/partners/kyc/${partnerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh partner data
        fetchPartnerData(partnerId);
        setIsSubmitted(true);
      } else {
        alert(data.error || "Failed to submit KYC");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check KYC status and redirect if approved
  useEffect(() => {
    if (partner?.kycStatus === 'approved') {
      router.push('/pickups');
    }
  }, [partner?.kycStatus, router]);

  // Show waiting page if KYC is submitted
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-lg">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">KYC Under Review</h2>
          <p className="text-gray-600 mb-6">Your KYC documents have been submitted successfully. Our admin team will review and approve within 24-48 hours.</p>
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#f0ebf8' }}>
            <p className="text-sm font-medium" style={{ color: '#452D9B' }}>Status: {partner?.kycStatus?.toUpperCase() || 'PENDING'}</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="w-full text-white rounded-xl py-3 font-semibold"
            style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="text-2xl leading-none text-black">←</button>
          <h2 className="text-lg font-semibold text-black">KYC Verification</h2>
          <div></div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
          <select
            className="w-full rounded-xl border-2 px-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            value={formData.vehicleType}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
          >
            <option value="">Select Vehicle Type</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="car">Car</option>
          </select>
        </div>

        {/* Vehicle Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number *</label>
          <input
            className="w-full rounded-xl border-2 px-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Enter vehicle number"
            type="text"
            value={formData.vehicleNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
          />
        </div>

        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
          <input
            className="w-full rounded-xl border-2 px-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Enter 12-digit Aadhar number"
            type="text"
            maxLength="12"
            value={formData.aadharNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value }))}
          />
        </div>

        {/* Aadhar Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload('aadharImage', e.target.files[0])}
            className="hidden"
            id="aadhar-upload"
          />
          <label
            htmlFor="aadhar-upload"
            className="w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
            style={{ borderColor: '#b8a7d9' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0ebf8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {formData.aadharImage ? (
              <img src={formData.aadharImage} alt="Aadhar" className="h-28 object-contain" />
            ) : (
              <span style={{ color: '#452D9B' }}>+ Upload Aadhar Card</span>
            )}
          </label>
        </div>

        {/* Driving License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Number *</label>
          <input
            className="w-full rounded-xl border-2 px-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Enter driving license number"
            type="text"
            value={formData.drivingLicenseNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, drivingLicenseNumber: e.target.value }))}
          />
        </div>

        {/* Driving License Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload('drivingLicenseImage', e.target.files[0])}
            className="hidden"
            id="license-upload"
          />
          <label
            htmlFor="license-upload"
            className="w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"
            style={{ borderColor: '#b8a7d9' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0ebf8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {formData.drivingLicenseImage ? (
              <img src={formData.drivingLicenseImage} alt="License" className="h-28 object-contain" />
            ) : (
              <span style={{ color: '#452D9B' }}>+ Upload Driving License</span>
            )}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-white rounded-xl py-3 text-base font-semibold"
          style={!loading ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </div>
    </div>
  );
}
