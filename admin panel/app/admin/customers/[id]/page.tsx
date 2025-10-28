'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

interface Customer {
  _id: string
  name: string
  mobile: string
  email?: string
  totalSpend: number
  totalOrders: number
  walletBalance: number
  loyaltyPoints: number
  isActive: boolean
  lastOrderDate?: string
  address: Array<{
    street: string
    city: string
    state: string
    pincode: string
    isDefault: boolean
  }>
  createdAt: string
}

export default function CustomerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`)
      const data = await response.json()
      if (data.success) {
        setCustomer(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout activePage="Customers" title="Customer Profile">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </ResponsiveLayout>
    )
  }

  if (!customer) {
    return (
      <ResponsiveLayout activePage="Customers" title="Customer Profile">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Customer not found</div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout activePage="Customers" title="Customer Profile">
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
          {/* Customer Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Customer Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>ID:</strong> #{customer._id.slice(-6)}</div>
              <div><strong>Name:</strong> {customer.name}</div>
              <div><strong>Mobile:</strong> {customer.mobile}</div>
              <div><strong>Email:</strong> {customer.email || 'Not provided'}</div>
              <div><strong>Status:</strong> 
                <span style={{ 
                  color: customer.isActive ? '#16a34a' : '#dc2626',
                  fontWeight: 'bold'
                }}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div><strong>Member Since:</strong> {new Date(customer.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>₹{customer.totalSpend}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total Spend</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{customer.totalOrders}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total Orders</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>₹{customer.walletBalance}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Wallet Balance</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{customer.loyaltyPoints}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Loyalty Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {customer.address && customer.address.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginTop: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Addresses</h3>
            {customer.address.map((addr, index) => (
              <div key={index} style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {addr.isDefault && <span style={{ color: '#2563eb' }}>[Default] </span>}
                  Address {index + 1}
                </div>
                <div>{addr.street}</div>
                <div>{addr.city}, {addr.state} - {addr.pincode}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}