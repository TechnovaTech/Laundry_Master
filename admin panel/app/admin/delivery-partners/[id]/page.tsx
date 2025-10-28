'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

interface Partner {
  _id: string
  name: string
  mobile: string
  email?: string
  profileImage?: string
  vehicleNumber?: string
  vehicleType?: string
  aadharNumber?: string
  panNumber?: string
  drivingLicenseNumber?: string
  aadharImage?: string
  drivingLicenseImage?: string
  kycStatus?: string
  kycRejectionReason?: string
  bankDetails?: {
    accountHolderName?: string
    accountNumber: string
    ifscCode: string
    bankName: string
    branch?: string
  }
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  isVerified: boolean
  isActive: boolean
  rating: number
  totalDeliveries: number
  totalEarnings: number
  createdAt: string
}

export default function PartnerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const partnerId = params.id as string
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartner()
  }, [partnerId])

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/mobile/partners/${partnerId}`)
      const data = await response.json()
      if (data.success) {
        setPartner(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch partner:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout activePage="Delivery Partners" title="Partner Profile">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </ResponsiveLayout>
    )
  }

  if (!partner) {
    return (
      <ResponsiveLayout activePage="Delivery Partners" title="Partner Profile">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Partner not found</div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout activePage="Delivery Partners" title="Partner Profile">
      <div style={{ padding: '1.5rem' }}>
        <button 
          onClick={() => router.back()}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        {/* Partner Info */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>Partner Information</h3>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
            {partner.profileImage ? (
              <img src={partner.profileImage} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#6b7280' }}>
                {partner.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><strong>ID:</strong> #{partner._id.slice(-6)}</div>
                <div><strong>Name:</strong> {partner.name}</div>
                <div><strong>Mobile:</strong> {partner.mobile}</div>
                <div><strong>Email:</strong> {partner.email || 'Not provided'}</div>
                <div><strong>Rating:</strong> ⭐ {partner.rating.toFixed(1)}</div>
                <div><strong>Status:</strong> 
                  <span style={{ color: partner.isActive ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                    {partner.isActive ? ' Active' : ' Inactive'}
                  </span>
                </div>
                <div><strong>Verified:</strong> 
                  <span style={{ color: partner.isVerified ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                    {partner.isVerified ? ' Yes' : ' No'}
                  </span>
                </div>
                <div><strong>Joined:</strong> {new Date(partner.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04' }}>{partner.totalDeliveries}</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Total Pickups</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{partner.totalDeliveries}</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Total Deliveries</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>₹{partner.totalEarnings.toLocaleString()}</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>Total Earnings</div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>Vehicle Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Vehicle Type:</strong> {partner.vehicleType || 'Not provided'}</div>
            <div><strong>Vehicle Number:</strong> {partner.vehicleNumber || 'Not provided'}</div>
          </div>
        </div>

        {/* KYC Details */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb' }}>KYC Details</h3>
            <span style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              backgroundColor: partner.kycStatus === 'approved' ? '#dcfce7' : partner.kycStatus === 'rejected' ? '#fee2e2' : '#fef3c7',
              color: partner.kycStatus === 'approved' ? '#16a34a' : partner.kycStatus === 'rejected' ? '#dc2626' : '#ca8a04'
            }}>
              {partner.kycStatus?.toUpperCase() || 'PENDING'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div><strong>Aadhar Number:</strong> {partner.aadharNumber || 'Not provided'}</div>
            <div><strong>Driving License:</strong> {partner.drivingLicenseNumber || 'Not provided'}</div>
          </div>
          {partner.kycRejectionReason && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>
              <strong style={{ color: '#dc2626' }}>Rejection Reason:</strong>
              <div style={{ color: '#991b1b', marginTop: '0.5rem' }}>{partner.kycRejectionReason}</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {partner.aadharImage && (
              <div>
                <strong>Aadhar Card Image:</strong>
                <img src={partner.aadharImage} alt="Aadhar" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginTop: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
            )}
            {partner.drivingLicenseImage && (
              <div>
                <strong>Driving License Image:</strong>
                <img src={partner.drivingLicenseImage} alt="License" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginTop: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        </div>

        {/* Bank Details */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>Bank Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Account Holder Name:</strong> {partner.bankDetails?.accountHolderName || 'Not provided'}</div>
            <div><strong>Account Number:</strong> {partner.bankDetails?.accountNumber || 'Not provided'}</div>
            <div><strong>IFSC Code:</strong> {partner.bankDetails?.ifscCode || 'Not provided'}</div>
            <div><strong>Bank Name:</strong> {partner.bankDetails?.bankName || 'Not provided'}</div>
            <div><strong>Branch:</strong> {partner.bankDetails?.branch || 'Not provided'}</div>
          </div>
        </div>

        {/* Address */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>Address</h3>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            {partner.address?.street ? (
              <>
                <div>{partner.address.street}</div>
                <div>{partner.address.city}, {partner.address.state} - {partner.address.pincode}</div>
              </>
            ) : (
              <div>Not provided</div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
