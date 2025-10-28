"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partnerData, setPartnerData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: { street: "", city: "", state: "", pincode: "" },
    vehicleType: "",
    vehicleNumber: ""
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
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || ""
          },
          vehicleType: data.vehicleType || "",
          vehicleNumber: data.vehicleNumber || ""
        });
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const partnerId = localStorage.getItem("partnerId");

      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: partnerData.name,
          email: partnerData.email,
          address: partnerData.address,
          vehicleType: partnerData.vehicleType,
          vehicleNumber: partnerData.vehicleNumber
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        fetchPartnerData();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
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
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium disabled:bg-gray-400"
              style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
            >
              {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-800">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.name}
                  onChange={(e) => setPartnerData({...partnerData, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.name || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Mobile Number</label>
              <p className="text-base font-normal text-gray-900">{partnerData.mobile || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={partnerData.email}
                  onChange={(e) => setPartnerData({...partnerData, email: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.email || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Pincode</label>
              <p className="text-base font-normal text-gray-900">{partnerData.address.pincode || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">City</label>
              <p className="text-base font-normal text-gray-900">{partnerData.address.city || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">State</label>
              <p className="text-base font-normal text-gray-900">{partnerData.address.state || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.address.street}
                  onChange={(e) => setPartnerData({...partnerData, address: {...partnerData.address, street: e.target.value}})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.address.street || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Type</label>
              {isEditing ? (
                <select
                  value={partnerData.vehicleType}
                  onChange={(e) => setPartnerData({...partnerData, vehicleType: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.vehicleType || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.vehicleNumber}
                  onChange={(e) => setPartnerData({...partnerData, vehicleNumber: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.vehicleNumber || "N/A"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
