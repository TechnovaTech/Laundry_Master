'use client'

import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    activeDeliveries: 0,
    completedOrders: 0,
    revenueToday: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [ordersChartData, setOrdersChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [revenueChartData, setRevenueChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch('http://localhost:3000/api/orders')
      const ordersData = await ordersRes.json()
      
      if (ordersData.success) {
        const orders = ordersData.data
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Calculate stats
        const ordersToday = orders.filter((o: any) => new Date(o.createdAt) >= today).length
        const activeDeliveries = orders.filter((o: any) => 
          ['pending', 'picked_up', 'processing', 'out_for_delivery'].includes(o.status)
        ).length
        const completedOrders = orders.filter((o: any) => o.status === 'delivered').length
        const revenueToday = orders
          .filter((o: any) => new Date(o.createdAt) >= today)
          .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        
        setStats({
          ordersToday,
          activeDeliveries,
          completedOrders,
          revenueToday
        })
        
        // Get recent activity
        const recent = orders
          .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
          .slice(0, 5)
          .map((o: any) => ({
            text: `Order #${o.orderId} - ${o.status}`,
            time: new Date(o.updatedAt || o.createdAt).toLocaleString()
          }))
        
        setRecentActivity(recent)
        
        // Calculate last 7 days orders data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          date.setHours(0, 0, 0, 0)
          return date
        })
        
        const ordersPerDay = last7Days.map(date => {
          const nextDay = new Date(date)
          nextDay.setDate(nextDay.getDate() + 1)
          return orders.filter((o: any) => {
            const orderDate = new Date(o.createdAt)
            return orderDate >= date && orderDate < nextDay
          }).length
        })
        
        const revenuePerDay = last7Days.map(date => {
          const nextDay = new Date(date)
          nextDay.setDate(nextDay.getDate() + 1)
          return orders
            .filter((o: any) => {
              const orderDate = new Date(o.createdAt)
              return orderDate >= date && orderDate < nextDay
            })
            .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        })
        
        setOrdersChartData(ordersPerDay)
        setRevenueChartData(revenuePerDay)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout activePage="Dashboard" title="Dashboard" searchPlaceholder="Search...">
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>Loading...</div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout activePage="Dashboard" title="Dashboard" searchPlaceholder="Search...">

        {/* Dashboard Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
            {/* Left Section - Stats Cards, Charts and Action Buttons */}
            <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.ordersToday}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Orders Today</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.activeDeliveries}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Active Deliveries</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.completedOrders}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Completed Orders</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>₹{stats.revenueToday.toLocaleString()}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Revenue Today</div>
                </div>
              </div>


              {/* Charts Side by Side */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Orders Overview Chart */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Orders Overview (Last 7 Days)</h3>
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(45deg, #e5f3ff 0%, #f0f9ff 100%)',
                    borderRadius: '8px',
                    position: 'relative',
                    padding: '1rem'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 180" style={{ overflow: 'visible' }}>
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="40" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="140" x2="380" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                      
                      {/* Line graph */}
                      <polyline
                        points={ordersChartData.map((count, index) => {
                          const maxOrders = Math.max(...ordersChartData, 1)
                          const x = 40 + (index * 340 / 6)
                          const y = 140 - ((count / maxOrders) * 100)
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Area fill */}
                      <polygon
                        points={`40,140 ${ordersChartData.map((count, index) => {
                          const maxOrders = Math.max(...ordersChartData, 1)
                          const x = 40 + (index * 340 / 6)
                          const y = 140 - ((count / maxOrders) * 100)
                          return `${x},${y}`
                        }).join(' ')} 380,140`}
                        fill="url(#ordersGradient)"
                        opacity="0.3"
                      />
                      
                      {/* Data points */}
                      {ordersChartData.map((count, index) => {
                        const maxOrders = Math.max(...ordersChartData, 1)
                        const x = 40 + (index * 340 / 6)
                        const y = 140 - ((count / maxOrders) * 100)
                        return (
                          <g key={index}>
                            <circle cx={x} cy={y} r="4" fill="#2563eb" stroke="white" strokeWidth="2" />
                            <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="bold">{count}</text>
                            <text x={x} y="160" textAnchor="middle" fontSize="9" fill="#6b7280">
                              {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                            </text>
                          </g>
                        )
                      })}
                      
                      <defs>
                        <linearGradient id="ordersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Revenue (Last 7 Days)</h3>
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(45deg, #ecfdf5 0%, #f0fdf4 100%)',
                    borderRadius: '8px',
                    position: 'relative',
                    padding: '1rem'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 180" style={{ overflow: 'visible' }}>
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="40" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="40" y1="140" x2="380" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                      
                      {/* Line graph */}
                      <polyline
                        points={revenueChartData.map((revenue, index) => {
                          const maxRevenue = Math.max(...revenueChartData, 1)
                          const x = 40 + (index * 340 / 6)
                          const y = 140 - ((revenue / maxRevenue) * 100)
                          return `${x},${y}`
                        }).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Area fill */}
                      <polygon
                        points={`40,140 ${revenueChartData.map((revenue, index) => {
                          const maxRevenue = Math.max(...revenueChartData, 1)
                          const x = 40 + (index * 340 / 6)
                          const y = 140 - ((revenue / maxRevenue) * 100)
                          return `${x},${y}`
                        }).join(' ')} 380,140`}
                        fill="url(#revenueGradient)"
                        opacity="0.3"
                      />
                      
                      {/* Data points */}
                      {revenueChartData.map((revenue, index) => {
                        const maxRevenue = Math.max(...revenueChartData, 1)
                        const x = 40 + (index * 340 / 6)
                        const y = 140 - ((revenue / maxRevenue) * 100)
                        return (
                          <g key={index}>
                            <circle cx={x} cy={y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                            <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fill="#10b981" fontWeight="bold">₹{revenue}</text>
                            <text x={x} y="160" textAnchor="middle" fontSize="9" fill="#6b7280">
                              {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                            </text>
                          </g>
                        )
                      })}
                      
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Manage Orders
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Assign Delivery Partner
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Update Pricing
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div style={{ flex: '1', minWidth: '300px', display: 'flex' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{activity.text}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', color: '#6b7280' }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}