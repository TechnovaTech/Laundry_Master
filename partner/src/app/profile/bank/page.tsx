"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BankDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partnerData, setPartnerData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: ""
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
          accountHolderName: data.bankDetails?.accountHolderName || "",
          accountNumber: data.bankDetails?.accountNumber || "",
          ifscCode: data.bankDetails?.ifscCode || "",
          bankName: data.bankDetails?.bankName || "",
          branch: data.bankDetails?.branch || ""
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
          bankDetails: {
            accountHolderName: partnerData.accountHolderName,
            accountNumber: partnerData.accountNumber,
            ifscCode: partnerData.ifscCode,
            bankName: partnerData.bankName,
            branch: partnerData.branch
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Bank details updated successfully!");
        setIsEditing(false);
        fetchPartnerData();
      } else {
        alert("Failed to update bank details");
      }
    } catch (error) {
      alert("Error updating bank details");
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
            <h2 className="text-lg font-semibold text-gray-900">Bank Account Information</h2>
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
              <label className="text-sm font-semibold text-gray-800">Account Holder Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.accountHolderName}
                  onChange={(e) => setPartnerData({...partnerData, accountHolderName: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.accountHolderName || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Account Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.accountNumber}
                  onChange={(e) => setPartnerData({...partnerData, accountNumber: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.accountNumber || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">IFSC Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.ifscCode}
                  onChange={(e) => setPartnerData({...partnerData, ifscCode: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.ifscCode || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Bank Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.bankName}
                  onChange={(e) => setPartnerData({...partnerData, bankName: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.bankName || "N/A"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Branch</label>
              {isEditing ? (
                <input
                  type="text"
                  value={partnerData.branch}
                  onChange={(e) => setPartnerData({...partnerData, branch: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              ) : (
                <p className="text-base font-normal text-gray-900">{partnerData.branch || "N/A"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
