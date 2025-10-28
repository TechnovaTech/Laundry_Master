"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KYCDetails() {
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    const partnerToken = localStorage.getItem("partnerToken");
    
    if (!partnerId || !partnerToken) {
      router.push("/login");
      return;
    }
    
    fetchPartnerStatus(partnerId);
  }, []);

  const fetchPartnerStatus = async (partnerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const data = await response.json();
      if (data.success) {
        setPartner(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch partner:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#e0d4f7', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              partner?.kycStatus === "approved" ? "bg-green-100 text-green-800" :
              partner?.kycStatus === "rejected" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {partner?.kycStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Type</label>
              <p className="text-base font-normal text-gray-900">{partner?.vehicleType || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Number</label>
              <p className="text-base font-normal text-gray-900">{partner?.vehicleNumber || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Aadhar Number</label>
              <p className="text-base font-normal text-gray-900">{partner?.aadharNumber || "N/A"}</p>
            </div>
            {partner?.aadharImage && (
              <div>
                <label className="text-sm font-semibold text-gray-800">Aadhar Card Image</label>
                <img src={partner.aadharImage} alt="Aadhar" className="mt-2 w-full max-w-md h-48 object-contain rounded-lg border" />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-800">Driving License Number</label>
              <p className="text-base font-normal text-gray-900">{partner?.drivingLicenseNumber || "N/A"}</p>
            </div>
            {partner?.drivingLicenseImage && (
              <div>
                <label className="text-sm font-semibold text-gray-800">Driving License Image</label>
                <img src={partner.drivingLicenseImage} alt="License" className="mt-2 w-full max-w-md h-48 object-contain rounded-lg border" />
              </div>
            )}
            {partner?.kycRejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="text-sm font-semibold text-red-800">Rejection Reason</label>
                <p className="text-sm text-red-600 mt-1">{partner.kycRejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
