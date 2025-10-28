"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profileImage: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    vehicleType: "",
    vehicleNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const partnerMobile = localStorage.getItem("partnerMobile");
    if (partnerMobile) {
      setFormData(prev => ({ ...prev, mobile: partnerMobile }));
    }
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/partners/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("partnerId", data.data._id || data.data.partnerId);
        localStorage.setItem("partnerName", data.data.name);
        router.push("/profile/kyc");
      } else {
        alert(data.error || "Failed to save profile");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/verify" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Create Profile</h2>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="font-semibold disabled:text-gray-400"
            style={{ color: '#452D9B' }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Add Profile Photo */}
      <div className="px-4 pt-6 flex flex-col items-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result;
                setProfileImage(base64);
                setFormData(prev => ({ ...prev, profileImage: base64 }));
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden" 
          id="profile-photo"
        />
        <label 
          htmlFor="profile-photo" 
          className="size-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="size-28 rounded-full object-cover" />
          ) : (
            <span className="text-3xl" style={{ color: '#452D9B' }}>+</span>
          )}
        </label>
        <p className="mt-3 text-sm text-gray-600">Add Profile Photo</p>
      </div>

      {/* Form */}
      <form className="px-4 mt-6 flex flex-col gap-4">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>👤</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Email Address */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>✉️</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        {/* Mobile Number */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>📞</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="123-456-7890"
            type="tel"
            value={formData.mobile}
            readOnly
          />
        </div>

        {/* Pincode */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>📍</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-sm text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Pincode - Use same as availability check"
            type="text"
            value={formData.address.pincode}
            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
          />
        </div>
      </form>



      {/* Save & Continue */}
      <div className="px-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="mt-5 w-full text-white rounded-xl py-3 text-base font-semibold"
          style={!loading ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}