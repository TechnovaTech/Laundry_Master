'use client'

import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function Hubs() {
  const [hubs, setHubs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: { street: '', city: '', state: '', pincode: '' },
    pincodes: '',
    contactPerson: '',
    contactNumber: ''
  })

  useEffect(() => {
    fetchHubs()
  }, [])

  const fetchHubs = async () => {
    const response = await fetch('/api/hubs')
    const data = await response.json()
    if (data.success) setHubs(data.data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/hubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        pincodes: formData.pincodes.split(',').map(p => p.trim())
      })
    })
    if (response.ok) {
      setShowForm(false)
      fetchHubs()
      setFormData({ name: '', address: { street: '', city: '', state: '', pincode: '' }, pincodes: '', contactPerson: '', contactNumber: '' })
    }
  }

  return (
    <ResponsiveLayout activePage="Add-ons" title="Hub Management" searchPlaceholder="Search hubs...">
      <div style={{ padding: '1.5rem' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}>
          {showForm ? 'Cancel' : '+ Add Hub'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <input placeholder="Hub Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="Street" value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="City" value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="State" value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="Hub Pincode" value={formData.address.pincode} onChange={(e) => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="Service Pincodes (comma separated)" value={formData.pincodes} onChange={(e) => setFormData({...formData, pincodes: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <input placeholder="Contact Number" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%' }}>Create Hub</button>
          </form>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {hubs.map((hub) => (
            <div key={hub._id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{hub.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>📍 {hub.address.street}, {hub.address.city}, {hub.address.state} - {hub.address.pincode}</p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Service Pincodes: {hub.pincodes.join(', ')}</p>
              {hub.contactPerson && <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>Contact: {hub.contactPerson} - {hub.contactNumber}</p>}
            </div>
          ))}
        </div>
      </div>
    </ResponsiveLayout>
  )
}
