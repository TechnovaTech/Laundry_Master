"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState({
    name: "",
    mobile: "",
    email: "",
    kycStatus: "",
    profileImage: ""
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const partnerId = localStorage.getItem("partnerId");
      const partnerToken = localStorage.getItem("partnerToken");
      
      if (!partnerId || !partnerToken) {
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        setPartnerData({
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          kycStatus: data.kycStatus || "pending",
          profileImage: data.profileImage || ""
        });
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partnerId");
    localStorage.removeItem("partnerName");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#e0d4f7', borderTopColor: 'transparent' }} suppressHydrationWarning></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24" suppressHydrationWarning>
      <div className="p-4">
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex items-center gap-4">
            {partnerData.profileImage ? (
              <img src={partnerData.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: '#452D9B' }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: '#f0ebf8', color: '#452D9B' }}>
                {partnerData.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{partnerData.name}</h1>
              <p className="text-gray-600">{partnerData.mobile}</p>
            </div>
          </div>
        </div>

      <div className="space-y-4">
        <div 
          onClick={() => router.push("/profile/personal")}
          className="bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0ebf8' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#452D9B' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
            <p className="text-sm text-gray-500">View and edit your personal information</p>
          </div>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div 
          onClick={() => router.push("/profile/kyc-details")}
          className="bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">KYC Details</h3>
            <p className="text-sm text-gray-500">Verification documents and status</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              partnerData.kycStatus === "approved" ? "bg-green-100 text-green-800" :
              partnerData.kycStatus === "rejected" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {partnerData.kycStatus.toUpperCase()}
            </span>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div 
          onClick={() => router.push("/profile/bank")}
          className="bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
            <p className="text-sm text-gray-500">Manage your bank account information</p>
          </div>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
