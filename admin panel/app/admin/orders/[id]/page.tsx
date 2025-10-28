'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

export default function OrderDetails() {
  const params = useParams()
  const orderId = params.id
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResponsiveLayout activePage="Orders" title={`Order #${orderId}`} searchPlaceholder="Search...">

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading order details...
            </div>
          ) : !order ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Order not found
            </div>
          ) : (
          <div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to cancel this order?')) {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                  });
                  if (response.ok) window.location.reload();
                }
              }}
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel Order
            </button>
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to DELETE this order? This action cannot be undone.')) {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    alert('Order deleted successfully');
                    window.location.href = '/admin/orders';
                  }
                }
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Delete Order
            </button>
          </div>

          {/* Customer Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Customer Info</h3>
                <div style={{ color: '#374151', lineHeight: '1.6' }}>
                  <div><strong>Name:</strong> {order?.customerId?.name || 'N/A'}</div>
                  <div><strong>Mobile:</strong> {order?.customerId?.mobile || 'N/A'}</div>
                  <div><strong>Address:</strong> {order?.pickupAddress ? `${order.pickupAddress.street}, ${order.pickupAddress.city}, ${order.pickupAddress.state} - ${order.pickupAddress.pincode}` : 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#2563eb', cursor: 'pointer', fontSize: '0.9rem' }}>View Customer Profile</span>
                <span style={{ color: '#2563eb', fontSize: '1.2rem', cursor: 'pointer' }}>📞</span>
              </div>
            </div>
          </div>

          {/* Items in Order */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Items in Order</h3>
            {order?.items?.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{item.quantity} {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            )) || <div>No items found</div>}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#2563eb' }}>
              <span>Total: ₹{order?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Assigned Partner */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Assigned Partner</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Partner Name:</strong> {order?.partnerId?.name || 'Not Assigned'} {order?.partnerId?._id ? `(#${order.partnerId._id.slice(-4)})` : ''}
                </div>
                {order?.partnerId?.mobile && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Mobile:</strong> {order.partnerId.mobile}
                  </div>
                )}
              </div>
              <span style={{ color: order?.partnerId ? '#10b981' : '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                {order?.partnerId ? 'Assigned' : 'Not Assigned'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Reassign Partner
              </button>
              {order?.partnerId && (
                <button 
                  onClick={() => window.location.href = `/admin/delivery-partners/${order.partnerId._id}`}
                  style={{
                    backgroundColor: 'white',
                    color: '#2563eb',
                    border: '2px solid #2563eb',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  View Partner Profile
                </button>
              )}
            </div>
          </div>

          {/* Hub Delivery Approval */}
          {order?.status === 'delivered_to_hub' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Hub Delivery Approval</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Order has been delivered to hub. Please approve or cancel.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={async () => {
                    const response = await fetch(`/api/orders/${order._id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        status: 'ready',
                        hubApprovedAt: new Date().toISOString()
                      })
                    });
                    if (response.ok) window.location.reload();
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      const response = await fetch(`/api/orders/${order._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'cancelled' })
                      });
                      if (response.ok) window.location.reload();
                    }
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  ✗ Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* Ready to Process */}
          {order?.status === 'ready' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Ready to Process</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Order is ready. Click below to start processing.</p>
              <button
                onClick={async () => {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'processing' })
                  });
                  if (response.ok) window.location.reload();
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Start Processing
              </button>
            </div>
          )}

          {/* Reported Issue */}
          {order?.issue && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '2px solid #ef4444'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#ef4444' }}>⚠ Reported Issue</h3>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <p style={{ color: '#374151' }}>{order.issue}</p>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Reported on: {order.issueReportedAt ? new Date(order.issueReportedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.issueReportedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
              </p>
            </div>
          )}

          {/* Pickup Photos */}
          {order?.pickupPhotos && order.pickupPhotos.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Pickup Photos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {order.pickupPhotos.map((photo: string, index: number) => (
                  <img 
                    key={index} 
                    src={photo} 
                    alt={`Pickup ${index + 1}`} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => window.open(photo, '_blank')}
                  />
                ))}
              </div>
              {order?.pickupNotes && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  <strong>Partner Notes:</strong> {order.pickupNotes}
                </div>
              )}
            </div>
          )}

          {/* Order Status Timeline */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Order Status Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontWeight: '600' }}>Order Placed</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Reached Location</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.reachedLocationAt ? new Date(order.reachedLocationAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.reachedLocationAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Picked Up</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.pickedUpAt ? new Date(order.pickedUpAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.pickedUpAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Delivered to Hub</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.deliveredToHubAt ? new Date(order.deliveredToHubAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredToHubAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Processing</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.hubApprovedAt ? new Date(order.hubApprovedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.hubApprovedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Ironing</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.ironingAt ? new Date(order.ironingAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.ironingAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Process Completed</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.processCompletedAt ? new Date(order.processCompletedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.processCompletedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Out for Delivery</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.outForDeliveryAt ? new Date(order.outForDeliveryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.outForDeliveryAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Delivered</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Issues */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Notes & Issues</h3>
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>Note log</div>
            <textarea
              placeholder="Add a note..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
                marginBottom: '1rem',
                fontFamily: 'inherit'
              }}
            />
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}>
              Add Note
            </button>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Download Invoice (PDF)
            </button>
            <button style={{
              backgroundColor: 'white',
              color: '#2563eb',
              border: '2px solid #2563eb',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Print Slip
            </button>
          </div>
          </div>
          )}
        </div>
    </ResponsiveLayout>
  )
}