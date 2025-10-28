'use client'

import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function NotificationsPage() {
  const notifications = [
    { title: 'Weekly Update', message: 'Here is a brief overview of this week\'s...', audience: 'Customers', status: 'Sent', date: '2023-10-22 10:00 AM' },
    { title: 'Special Offer', message: 'Don\'t miss out on our exclusive...', audience: 'Both', status: 'Scheduled', date: '2023-10-25 08:00 PM' }
  ]

  return (
    <ResponsiveLayout activePage="Notifications" title="Notifications" searchPlaceholder="Search notifications">
        
        <div style={{ padding: '1.5rem' }}>
          {/* Create Notification Section */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Create Notification</h3>
            
            <input 
              type="text" 
              placeholder="Title" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                outline: 'none', 
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            />
            
            <textarea 
              placeholder="Message Body" 
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                outline: 'none', 
                marginBottom: '1rem',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
            
            <select 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                outline: 'none', 
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            >
              <option>Audience: Customers</option>
              <option>Audience: Partners</option>
              <option>Audience: Both</option>
            </select>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input type="radio" name="schedule" defaultChecked />
                Now
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input type="radio" name="schedule" />
                Select Date & Time
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '500' 
              }}>
                Send Notification
              </button>
              <button style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: 'white', 
                color: '#2563eb', 
                border: '1px solid #2563eb', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '500' 
              }}>
                Save as Draft
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2563eb', margin: 0 }}>Notifications List</h3>
            </div>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 1fr', gap: '1rem', fontSize: '0.9rem', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
              <div>Notification Title</div>
              <div>Message Preview</div>
              <div>Audience</div>
              <div>Status</div>
              <div>Sent On / Scheduled For</div>
              <div>Actions</div>
            </div>

            {notifications.map((notification, index) => (
              <div key={index} style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1.5fr 1fr', gap: '1rem', borderBottom: index < notifications.length - 1 ? '1px solid #f3f4f6' : 'none', fontSize: '0.9rem', alignItems: 'center' }}>
                <div style={{ fontWeight: '500' }}>{notification.title}</div>
                <div style={{ color: '#6b7280' }}>{notification.message}</div>
                <div>{notification.audience}</div>
                <div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    backgroundColor: notification.status === 'Sent' ? '#dcfce7' : '#dbeafe',
                    color: notification.status === 'Sent' ? '#16a34a' : '#2563eb'
                  }}>
                    {notification.status}
                  </span>
                </div>
                <div>{notification.date}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ cursor: 'pointer' }}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ cursor: 'pointer' }}>
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ cursor: 'pointer' }}>
                    <polyline points="23,4 23,10 17,10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>1-20 of 124 notifications</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '6px', fontSize: '0.9rem' }}>Prev</button>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '6px', fontSize: '0.9rem' }}>Next</button>
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}