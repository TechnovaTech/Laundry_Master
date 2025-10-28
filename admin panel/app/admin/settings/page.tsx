'use client'

import { useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function SettingsPage() {
  const [showResetModal, setShowResetModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [enable2FA, setEnable2FA] = useState(false)
  const [autoAssign, setAutoAssign] = useState(false)
  const [notifications, setNotifications] = useState({
    newOrders: true,
    partnerKYC: true,
    systemErrors: true
  })

  return (
    <ResponsiveLayout activePage="Settings" title="Settings" searchPlaceholder="Search...">
      <div style={{ padding: '1.5rem' }}>
        
        {/* Admin Profile Settings */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Admin Profile Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <input type="text" placeholder="Name" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }} />
            <input type="email" placeholder="Email" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }} />
            <input type="tel" placeholder="Mobile" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Upload/Change Photo</button>
          </div>
          <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Save Changes</button>
        </div>

        {/* System Configuration */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>System Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <select style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', color: '#9ca3af' }}>
              <option>₹</option>
            </select>
            <select style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', color: '#9ca3af' }}>
              <option>Select Timezone</option>
            </select>
          </div>
          <input type="text" placeholder="Serviceable Cities" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Auto-assign Delivery Partner</label>
          </div>
          <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Update Settings</button>
        </div>

        {/* Security Settings */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Security Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <input type="password" placeholder="Old Password" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }} />
            <input type="password" placeholder="New Password" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" checked={enable2FA} onChange={(e) => setEnable2FA(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Enable 2FA</label>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem' }}>Session Management</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Session 1 - Active</span>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Revoke</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Session 2 - Active</span>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Revoke</button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Notification Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={notifications.newOrders} onChange={(e) => setNotifications({...notifications, newOrders: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>New Order Alerts</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={notifications.partnerKYC} onChange={(e) => setNotifications({...notifications, partnerKYC: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Partner KYC Approvals</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={notifications.systemErrors} onChange={(e) => setNotifications({...notifications, systemErrors: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>System Errors</label>
            </div>
          </div>
          <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>Save</button>
        </div>

        {/* Danger Zone */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', border: '2px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#ef4444' }}>Danger Zone</h3>
          <button onClick={() => setShowResetModal(true)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem' }}>Reset System Data</button>
          <button onClick={() => setShowDeleteModal(true)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>Delete Admin Account</button>
        </div>

        {/* Reset Modal */}
        {showResetModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Are you sure you want to reset the system data?</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowResetModal(false)} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Cancel</button>
                <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Are you sure you want to delete the admin account?</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteModal(false)} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Cancel</button>
                <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
