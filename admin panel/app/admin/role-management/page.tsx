'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface User {
  _id: string
  username?: string
  role: string
  email: string
  mobile: string
  address: string
  hub?: string
}

interface Hub {
  _id: string
  name: string
}

export default function RoleManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [passwordEdit, setPasswordEdit] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [hubs, setHubs] = useState<Hub[]>([])
  const [formData, setFormData] = useState({
    username: '',
    role: 'Admin',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    address: '',
    hub: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchHubs()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin-users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHubs = async () => {
    try {
      const response = await fetch('/api/hubs')
      const data = await response.json()
      if (data.success) {
        setHubs(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch hubs:', error)
    }
  }

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        alert('User added successfully!')
        setFormData({ username: '', role: 'Admin', email: '', password: '', confirmPassword: '', mobile: '', address: '', hub: '' })
        setShowAddUserForm(false)
        fetchUsers()
      } else {
        alert('Failed to add user: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to add user:', error)
      alert('Failed to add user')
    }
  }

  const handleUpdateUser = async () => {
    try {
      let updateData: any = { ...editingUser }
      
      if (passwordEdit.newPassword) {
        if (!passwordEdit.oldPassword) {
          alert('Please enter old password to change password')
          return
        }
        if (passwordEdit.newPassword !== passwordEdit.confirmPassword) {
          alert('New passwords do not match')
          return
        }
        updateData.oldPassword = passwordEdit.oldPassword
        updateData.password = passwordEdit.newPassword
      }
      
      const response = await fetch('/api/admin-users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      const data = await response.json()
      if (response.ok) {
        alert('User updated successfully!')
        
        // Update localStorage if editing current user
        const currentUser = localStorage.getItem('adminUser')
        if (currentUser) {
          const user = JSON.parse(currentUser)
          if (user.email === editingUser.email) {
            localStorage.setItem('adminUser', JSON.stringify({
              ...user,
              username: editingUser.username,
              role: editingUser.role,
              hub: editingUser.hub
            }))
          }
        }
        
        setEditingUser(null)
        setPasswordEdit({ oldPassword: '', newPassword: '', confirmPassword: '' })
        fetchUsers()
      } else {
        alert('Failed to update user: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const response = await fetch(`/api/admin-users?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        alert('User deleted successfully!')
        fetchUsers()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <ResponsiveLayout activePage="Role Management" title="Role Management" searchPlaceholder="Search...">
      <div style={{ padding: '1.5rem' }}>
        {/* Add User Button - Top Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowAddUserForm(true)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + Add User
          </button>
        </div>

        {!loading && users.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div>
              <img src="/Group.svg" alt="Role Management" style={{ width: '120px', height: '120px' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                No roles assigned yet.
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
                Create roles and assign users to manage permissions.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Users</h3>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Username</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Role</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Email</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Mobile</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Address</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} style={{ borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{user.username || user.email.split('@')[0]}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{user.role}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{user.email}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{user.mobile}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>{user.address}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span onClick={() => setEditingUser(user)} style={{ color: '#2563eb', cursor: 'pointer' }}>Edit</span>
                        <span onClick={() => handleDeleteUser(user._id)} style={{ color: '#dc2626', cursor: 'pointer', marginLeft: '0.5rem' }}> | Delete</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Add User Form Modal */}
        {showAddUserForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Add New User</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Store Manager">Store Manager</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 40px 0.75rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem 40px 0.75rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Address</label>
                  <textarea
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '80px' }}
                  />
                </div>

                {formData.role === 'Store Manager' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Hub</label>
                    <select
                      value={formData.hub}
                      onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      <option value="">Select Hub</option>
                      {hubs.map((hub) => (
                        <option key={hub._id} value={hub.name}>{hub.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleAddUser}
                  disabled={!formData.username || !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword || !formData.mobile || !formData.address || (formData.role === 'Store Manager' && !formData.hub)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: (formData.username && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.mobile && formData.address && (formData.role === 'Admin' || formData.hub)) ? '#10b981' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (formData.username && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.mobile && formData.address && (formData.role === 'Admin' || formData.hub)) ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowAddUserForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Edit User</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Username</label>
                  <input
                    type="text"
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Store Manager">Store Manager</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Mobile Number</label>
                  <input
                    type="tel"
                    value={editingUser.mobile}
                    onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Address</label>
                  <textarea
                    value={editingUser.address}
                    onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '80px' }}
                  />
                </div>

                {editingUser.role === 'Store Manager' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Hub</label>
                    <select
                      value={editingUser.hub || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, hub: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      <option value="">Select Hub</option>
                      {hubs.map((hub) => (
                        <option key={hub._id} value={hub.name}>{hub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Change Password (Optional)</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Old Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="Enter old password"
                        value={passwordEdit.oldPassword}
                        onChange={(e) => setPasswordEdit({ ...passwordEdit, oldPassword: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 40px 0.75rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        {showOldPassword ? '👁️' : '👁️🗨️'}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={passwordEdit.newPassword}
                        onChange={(e) => setPasswordEdit({ ...passwordEdit, newPassword: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 40px 0.75rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        {showNewPassword ? '👁️' : '👁️🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={passwordEdit.confirmPassword}
                        onChange={(e) => setPasswordEdit({ ...passwordEdit, confirmPassword: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 40px 0.75rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        {showConfirmNewPassword ? '👁️' : '👁️🗨️'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleUpdateUser}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
