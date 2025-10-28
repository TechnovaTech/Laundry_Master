'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface Partner {
  _id: string
  name: string
  mobile: string
  totalDeliveries: number
  totalEarnings: number
  isActive: boolean
  isVerified: boolean
  createdAt: string
}

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    blockedPartners: 0
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortFilter, setSortFilter] = useState('all')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState({ partnerId: '', isActive: false })

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [partners, statusFilter, sortFilter])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/mobile/partners')
      const data = await response.json()
      if (data.success) {
        setPartners(data.data)
        setFilteredPartners(data.data)
        calculateStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (partnerData: Partner[]) => {
    const total = partnerData.length
    const active = partnerData.filter(p => p.isActive).length
    const blocked = partnerData.filter(p => !p.isActive).length
    setStats({ totalPartners: total, activePartners: active, blockedPartners: blocked })
  }

  const applyFilters = () => {
    let filtered = [...partners]

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.isActive)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.isActive)
    }

    // Sort filter
    if (sortFilter === 'most_deliveries') {
      filtered.sort((a, b) => b.totalDeliveries - a.totalDeliveries)
    } else if (sortFilter === 'least_deliveries') {
      filtered.sort((a, b) => a.totalDeliveries - b.totalDeliveries)
    } else if (sortFilter === 'highest_earnings') {
      filtered.sort((a, b) => b.totalEarnings - a.totalEarnings)
    }
    // 'all' means no specific sorting, keep original order

    setFilteredPartners(filtered)
  }

  return (
    <ResponsiveLayout activePage="Delivery Partners" title="Delivery Partners" searchPlaceholder="Search by Name / Partner ID">
        
        {/* Delivery Partners Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Partners</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalPartners}</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Today</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.activePartners}</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Blocked</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.blockedPartners}</div>
            </div>
          </div>

          {/* Filter Section */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '120px',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '150px',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="all">All</option>
              <option value="most_deliveries">Most Deliveries</option>
              <option value="least_deliveries">Least Deliveries</option>
              <option value="highest_earnings">Highest Earnings</option>
            </select>
          </div>

          {/* Partners Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            {/* Table Header */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1.5fr 1fr 2fr',
              gap: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>Partner ID</div>
              <div>Name</div>
              <div>Mobile</div>
              <div>Total Deliveries</div>
              <div>Earnings</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading partners...
              </div>
            ) : filteredPartners.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No partners found
              </div>
            ) : (
              filteredPartners.map((partner, index) => (
                <div
                  key={partner._id}
                  style={{
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1.5fr 1fr 2fr',
                    gap: '1rem',
                    borderBottom: index < filteredPartners.length - 1 ? '1px solid #f3f4f6' : 'none',
                    fontSize: '0.9rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>#{partner._id.slice(-6)}</div>
                  <div>{partner.name || 'Partner'}</div>
                  <div>{partner.mobile}</div>
                  <div>{partner.totalDeliveries}</div>
                  <div>₹{partner.totalEarnings}</div>
                <div>
                  <div 
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/mobile/partners/${partner._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive: !partner.isActive })
                        })
                        if (response.ok) {
                          fetchPartners()
                        }
                      } catch (error) {
                        console.error('Failed to update partner status:', error)
                      }
                    }}
                    style={{
                    width: '50px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: partner.isActive ? '#2563eb' : '#d1d5db',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: partner.isActive ? '28px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => window.location.href = `/admin/delivery-partners/${partner._id}`}
                    style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    View Profile
                  </button>
                  <button 
                    onClick={() => {
                      setConfirmAction({ partnerId: partner._id, isActive: partner.isActive })
                      setShowConfirmModal(true)
                    }}
                    style={{
                    backgroundColor: partner.isActive ? '#dc2626' : '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    {partner.isActive ? 'Block' : 'Unblock'}
                  </button>
                </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredPartners.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Showing {filteredPartners.length} of {partners.length} partners
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Confirm Action</h3>
                <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>Are you sure you want to {confirmAction.isActive ? 'block' : 'unblock'} this partner?</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowConfirmModal(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={async () => {
                    try {
                      const response = await fetch(`/api/mobile/partners/${confirmAction.partnerId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isActive: !confirmAction.isActive })
                      })
                      if (response.ok) {
                        fetchPartners()
                      }
                    } catch (error) {
                      console.error('Failed to update partner status:', error)
                    }
                    setShowConfirmModal(false)
                  }} style={{ padding: '0.5rem 1rem', backgroundColor: confirmAction.isActive ? '#dc2626' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{confirmAction.isActive ? 'Block' : 'Unblock'}</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </ResponsiveLayout>
  )
}