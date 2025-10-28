'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface Customer {
  _id: string
  name: string
  mobile: string
  totalSpend: number
  totalOrders: number
  lastOrderDate?: string
  isActive: boolean
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    highValueCustomers: 0
  })
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const customersPerPage = 20
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      if (data.success) {
        setCustomers(data.data)
        calculateStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (customerData: any[]) => {
    const total = customerData.length
    const active = customerData.filter(c => c.isActive).length
    const highValue = customerData.filter(c => (c.totalSpent || 0) > 10000).length
    setStats({ totalCustomers: total, activeCustomers: active, highValueCustomers: highValue })
  }

  const toggleSelection = (customerId: string) => {
    const newSelected = new Set(selectedCustomers)
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId)
    } else {
      newSelected.add(customerId)
    }
    setSelectedCustomers(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set())
    } else {
      setSelectedCustomers(new Set(customers.map(c => c._id)))
    }
  }

  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer)
  const totalPages = Math.ceil(customers.length / customersPerPage)

  const handleBulkDelete = async () => {
    if (selectedCustomers.size === 0) return
    setShowConfirmModal(false)
    
    try {
      const deletePromises = Array.from(selectedCustomers).map(async (id) => {
        const response = await fetch(`/api/customers/${id}`, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok) {
          throw new Error(`Failed to delete customer ${id}`)
        }
        return response.json()
      })
      
      await Promise.all(deletePromises)
      setToast({ show: true, message: `Successfully deleted ${selectedCustomers.size} customer(s)`, type: 'success' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
      setSelectedCustomers(new Set())
      setSelectionMode(false)
      fetchCustomers()
    } catch (error) {
      console.error('Failed to delete customers:', error)
      setToast({ show: true, message: 'Failed to delete some customers. Please try again.', type: 'error' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
    }
  }

  return (
    <ResponsiveLayout activePage="Customers" title="Customers" searchPlaceholder="Search by Name / Mobile">
        {/* Customers Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Filter Section */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '25px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '200px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>Sort by Most Orders</option>
            </select>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>From:</span>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>To:</span>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setSelectionMode(!selectionMode)
                  setSelectedCustomers(new Set())
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectionMode ? '#dc2626' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {selectionMode ? 'Cancel Selection' : 'Select Customers'}
              </button>
              {selectionMode && selectedCustomers.size > 0 && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Delete Selected ({selectedCustomers.size})
                </button>
              )}
            </div>
          </div>

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
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Customers</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#2563eb', fontSize: '1.2rem' }}>👥</span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalCustomers}</span>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Customers</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#2563eb', fontSize: '1.2rem' }}>👥</span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.activeCustomers}</span>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>High Value Customers</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>⭐</span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.highValueCustomers}</span>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: selectionMode ? '50px 1fr 2fr 2fr 1.5fr 1.5fr 2fr' : '1fr 2fr 2fr 1.5fr 1.5fr 2fr',
              gap: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb'
            }}>
              {selectionMode && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.size === currentCustomers.length && currentCustomers.length > 0}
                    onChange={() => {
                      if (selectedCustomers.size === currentCustomers.length) {
                        setSelectedCustomers(new Set())
                      } else {
                        setSelectedCustomers(new Set(currentCustomers.map(c => c._id)))
                      }
                    }}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              )}
              <div>Customer ID</div>
              <div>Name</div>
              <div>Mobile</div>
              <div>Last Order</div>
              <div>Total Spend</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading customers...
              </div>
            ) : customers.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    ●
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                      No customers found.
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      Try adjusting your search or filter criteria.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              currentCustomers.map((customer, index) => (
                <div
                  key={customer._id}
                  style={{
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: selectionMode ? '50px 1fr 2fr 2fr 1.5fr 1.5fr 2fr' : '1fr 2fr 2fr 1.5fr 1.5fr 2fr',
                    gap: '1rem',
                    borderBottom: index < currentCustomers.length - 1 ? '1px solid #f3f4f6' : 'none',
                    fontSize: '0.9rem',
                    alignItems: 'center',
                    backgroundColor: selectedCustomers.has(customer._id) ? '#eff6ff' : 'white'
                  }}
                >
                  {selectionMode && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer._id)}
                        onChange={() => toggleSelection(customer._id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                  <div style={{ fontWeight: '500' }}>#{customer._id.slice(-6)}</div>
                  <div>{customer.name || 'User'}</div>
                  <div>{customer.mobile}</div>
                  <div>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}</div>
                  <div>₹{customer.totalSpent || 0}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => window.location.href = `/admin/customers/${customer._id}`}
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
                  <button style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    Block
                  </button>
                  <button style={{
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
                    Adjust Points
                  </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, customers.length)} of {customers.length} customers
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === 1 ? '#d1d5db' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Prev
                </button>
                <span style={{ color: '#6b7280', fontSize: '0.9rem', padding: '0 0.5rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === totalPages ? '#d1d5db' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Confirm Delete</h3>
                <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>Are you sure you want to delete {selectedCustomers.size} customer(s)? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowConfirmModal(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleBulkDelete} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {toast.show && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{toast.message}</span>
              <button onClick={() => setToast({ show: false, message: '', type: '' })} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0 0.25rem'
              }}>×</button>
            </div>
          )}
      </div>
    </ResponsiveLayout>
  )
}