import React, { useEffect, useState } from 'react'

interface HeaderProps {
  title: string
  searchPlaceholder?: string
  onMobileMenuToggle?: () => void
}

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
)

export default function Header({ title, searchPlaceholder = "Search...", onMobileMenuToggle }: HeaderProps) {
  const [userName, setUserName] = useState('John Doe')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.username || user.name || 'User')
      setUserRole(user.role || '')
    }
  }, [])

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="hamburger-btn"
          onClick={onMobileMenuToggle}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            color: '#374151'
          }}
        >
          <HamburgerIcon />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          {title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          className="header-search"
          type="text"
          placeholder={searchPlaceholder}
          style={{
            padding: '0.5rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '25px',
            outline: 'none',
            width: '250px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <div className="header-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#2563eb', fontSize: '1.2rem' }}>🔔</span>
          <div style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            👤
          </div>
          <span style={{ fontWeight: '500' }}>{userRole}: {userName}</span>
        </div>
      </div>
    </div>
  )
}