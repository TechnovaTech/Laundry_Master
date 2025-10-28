'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

interface Partner {
  _id: string
  name: string
  mobile: string
  email?: string
  vehicleType?: string
  vehicleNumber?: string
  aadharNumber?: string
  drivingLicenseNumber?: string
  aadharImage?: string
  drivingLicenseImage?: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  kycSubmittedAt?: string
  kycRejectionReason?: string
}

export default function PartnerKYCDetailPage() {
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

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/mobile/partners/kyc/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })
      if (response.ok) {
        router.push('/admin/partner-kyc')
      }
    } catch (error) {
      console.error('Failed to approve:', error)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return
    
    try {
      const response = await fetch(`/api/mobile/partners/kyc/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason })
      })
      if (response.ok) {
        router.push('/admin/partner-kyc')
      }
    } catch (error) {
      console.error('Failed to reject:', error)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout activePage="Partner KYC" title="KYC Details">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </ResponsiveLayout>
    )
  }

  if (!partner) {
    return (
      <ResponsiveLayout activePage="Partner KYC" title="KYC Details">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Partner not found</div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout activePage="Partner KYC" title="KYC Details">
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Partner Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>ID:</strong> #{partner._id.slice(-6)}</div>
              <div><strong>Name:</strong> {partner.name}</div>
              <div><strong>Mobile:</strong> {partner.mobile}</div>
              <div><strong>Email:</strong> {partner.email || 'Not provided'}</div>
              <div><strong>KYC Status:</strong> 
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: 
                    partner.kycStatus === 'approved' ? '#dcfce7' :
                    partner.kycStatus === 'rejected' ? '#fee2e2' : '#fef3c7',
                  color:
                    partner.kycStatus === 'approved' ? '#16a34a' :
                    partner.kycStatus === 'rejected' ? '#dc2626' : '#ca8a04'
                }}>
                  {partner.kycStatus}
                </span>
              </div>
              {partner.kycSubmittedAt && (
                <div><strong>Submitted:</strong> {new Date(partner.kycSubmittedAt).toLocaleString()}</div>
              )}
              {partner.kycRejectionReason && (
                <div style={{ color: '#dc2626' }}>
                  <strong>Rejection Reason:</strong> {partner.kycRejectionReason}
                </div>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Vehicle & Document Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>Vehicle Type:</strong> {partner.vehicleType || 'Not provided'}</div>
              <div><strong>Vehicle Number:</strong> {partner.vehicleNumber || 'Not provided'}</div>
              <div><strong>Aadhar Number:</strong> {partner.aadharNumber || 'Not provided'}</div>
              <div><strong>Driving License:</strong> {partner.drivingLicenseNumber || 'Not provided'}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          {partner.aadharImage && (
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Aadhar Card Image</h3>
              <img 
                src={partner.aadharImage} 
                alt="Aadhar Card" 
                style={{ width: '100%', height: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
              />
            </div>
          )}

          {partner.drivingLicenseImage && (
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Driving License Image</h3>
              <img 
                src={partner.drivingLicenseImage} 
                alt="Driving License" 
                style={{ width: '100%', height: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
              />
            </div>
          )}
        </div>

        {partner.kycStatus === 'pending' && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            <button
              onClick={handleApprove}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Approve KYC
            </button>
            <button
              onClick={handleReject}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reject KYC
            </button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
