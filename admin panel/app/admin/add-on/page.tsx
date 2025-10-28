'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function AddOnPage() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      return hash || 'Pincode'
    }
    return 'Pincode'
  })
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [pincodes, setPincodes] = useState([])
  const [serviceableAreas, setServiceableAreas] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPincode, setSelectedPincode] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [vouchers, setVouchers] = useState([])
  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [slogan, setSlogan] = useState('')
  const [timeSlots, setTimeSlots] = useState([])
  const [slotTime, setSlotTime] = useState('')
  const [slotType, setSlotType] = useState('pickup')
  const [editingSlot, setEditingSlot] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [walletSettings, setWalletSettings] = useState({
    pointsPerRupee: 2,
    minRedeemPoints: 100,
    referralPoints: 50,
    signupBonusPoints: 25,
    orderCompletionPoints: 10
  })
  const [hubs, setHubs] = useState<any[]>([])
  const [hubForm, setHubForm] = useState({
    name: '',
    address: { street: '', city: '', state: '', pincode: '' },
    pincodes: [],
    contactPerson: '',
    contactNumber: ''
  })
  const [hubState, setHubState] = useState('')
  const [hubCity, setHubCity] = useState('')
  const [hubCities, setHubCities] = useState<string[]>([])
  const [hubPincodes, setHubPincodes] = useState<any[]>([])
  const [selectedServicePincodes, setSelectedServicePincodes] = useState<string[]>([])
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [heroItems, setHeroItems] = useState<any[]>([])
  const [heroUrl, setHeroUrl] = useState('')
  const [heroType, setHeroType] = useState('image')
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchStates()
    fetchServiceableAreas()
    fetchVouchers()
    fetchTimeSlots()
    fetchWalletSettings()
    fetchHubs()
    fetchHeroItems()
  }, [])

  const fetchHubs = async () => {
    const response = await fetch('/api/hubs')
    const data = await response.json()
    if (data.success) setHubs(data.data)
  }

  const fetchHeroItems = async () => {
    const response = await fetch('/api/hero-section')
    const data = await response.json()
    if (data.success) setHeroItems(data.data)
  }

  const addHeroItem = async () => {
    if (!heroUrl && !heroFile) return
    setUploading(true)
    
    let finalUrl = heroUrl
    if (heroFile) {
      const formData = new FormData()
      formData.append('file', heroFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.success) finalUrl = uploadData.url
    }
    
    const response = await fetch('/api/hero-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: heroType, 
        url: finalUrl, 
        order: heroItems.length 
      })
    })
    if (response.ok) {
      setHeroUrl('')
      setHeroFile(null)
      fetchHeroItems()
    }
    setUploading(false)
  }

  const removeHeroItem = async (id: string) => {
    const response = await fetch(`/api/hero-section?id=${id}`, { method: 'DELETE' })
    if (response.ok) fetchHeroItems()
  }

  const handleHubStateChange = (stateCode: string) => {
    setHubState(stateCode)
    setHubCity('')
    setHubPincodes([])
    setSelectedServicePincodes([])
    const cities = [...new Set(serviceableAreas.filter((a: any) => a.state === stateCode).map((a: any) => a.city))]
    setHubCities(cities)
  }

  const handleHubCityChange = (city: string) => {
    setHubCity(city)
    setSelectedServicePincodes([])
    const pincodes = serviceableAreas.filter((a: any) => a.state === hubState && a.city === city).map((a: any) => ({ pincode: a.pincode, area: a.area }))
    setHubPincodes(pincodes)
  }

  const addHub = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/hubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...hubForm,
        pincodes: selectedServicePincodes
      })
    })
    if (response.ok) {
      fetchHubs()
      setHubForm({ name: '', address: { street: '', city: '', state: '', pincode: '' }, pincodes: [], contactPerson: '', contactNumber: '' })
      setHubState('')
      setHubCity('')
      setSelectedServicePincodes([])
    }
  }

  const fetchWalletSettings = async () => {
    try {
      const response = await fetch('/api/wallet-settings')
      const data = await response.json()
      if (data.success) {
        setWalletSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error)
    }
  }

  const saveWalletSettings = async () => {
    try {
      const response = await fetch('/api/wallet-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletSettings)
      })
      const data = await response.json()
      if (data.success) {
        setToast({ show: true, message: 'Wallet settings saved successfully!', type: 'success' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
      }
    } catch (error) {
      setToast({ show: true, message: 'Failed to save wallet settings', type: 'error' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
    }
  }

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/locations/states')
      const data = await response.json()
      setStates(data)
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchCities = async (stateCode: string) => {
    try {
      const response = await fetch(`/api/locations/cities?state=${stateCode}`)
      const data = await response.json()
      setCities(data)
      setPincodes([])
      setSelectedCity('')
      setSelectedPincode('')
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchPincodes = async (city: string) => {
    try {
      const response = await fetch(`/api/locations/pincodes?city=${city}`)
      const data = await response.json()
      setPincodes(data)
      setSelectedPincode('')
    } catch (error) {
      console.error('Error fetching pincodes:', error)
    }
  }

  const fetchServiceableAreas = async () => {
    try {
      const response = await fetch('/api/serviceable-areas')
      const data = await response.json()
      setServiceableAreas(data)
    } catch (error) {
      console.error('Error fetching serviceable areas:', error)
    }
  }

  const handleStateChange = (e: any) => {
    const stateCode = e.target.value
    setSelectedState(stateCode)
    if (e.target.tagName === 'SELECT') {
      setCities([])
      setPincodes([])
      setSelectedCity('')
      setSelectedPincode('')
      setSelectedArea('')
      if (stateCode) {
        fetchCities(stateCode)
      }
    }
  }

  const handleCityChange = (e: any) => {
    const city = e.target.value
    setSelectedCity(city)
    setPincodes([])
    setSelectedPincode('')
    setSelectedArea('')
    if (city) {
      fetchPincodes(city)
    }
  }

  const handlePincodeChange = (e: any) => {
    if (e.target.value) {
      const pincodeData = JSON.parse(e.target.value)
      setSelectedPincode(pincodeData.pincode)
      setSelectedArea(pincodeData.area)
    } else {
      setSelectedPincode('')
      setSelectedArea('')
    }
  }

  const addServiceableArea = async () => {
    if (!selectedState || !selectedCity || !selectedPincode) return
    
    try {
      const response = await fetch('/api/serviceable-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          city: selectedCity,
          pincode: selectedPincode,
          area: selectedArea
        })
      })
      
      if (response.ok) {
        fetchServiceableAreas()
        setSelectedState('')
        setSelectedCity('')
        setSelectedPincode('')
        setSelectedArea('')
        setCities([])
        setPincodes([])
      }
    } catch (error) {
      console.error('Error adding serviceable area:', error)
    }
  }

  const removeServiceableArea = async (id: string) => {
    try {
      const response = await fetch(`/api/serviceable-areas?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchServiceableAreas()
      }
    } catch (error) {
      console.error('Error removing serviceable area:', error)
    }
  }

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/vouchers')
      const data = await response.json()
      if (data.success) {
        setVouchers(data.data)
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    }
  }

  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const addVoucher = async () => {
    if (!discount || !slogan) {
      console.log('Missing fields:', { discount, slogan })
      return
    }
    
    const autoCode = generateUniqueCode()
    
    console.log('Sending voucher data:', { code: autoCode, discount: Number(discount), slogan })
    
    try {
      const response = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: autoCode, discount: Number(discount), slogan })
      })
      
      const result = await response.json()
      console.log('API response:', result)
      
      if (response.ok) {
        setDiscount('')
        setSlogan('')
        fetchVouchers()
      } else {
        console.error('API error:', result)
      }
    } catch (error) {
      console.error('Error adding voucher:', error)
    }
  }

  const removeVoucher = async (id: string) => {
    try {
      const response = await fetch(`/api/vouchers?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchVouchers()
      }
    } catch (error) {
      console.error('Error removing voucher:', error)
    }
  }

  const editVoucher = (voucher: any) => {
    setEditingVoucher(voucher._id)
    setDiscount(voucher.discount.toString())
    setSlogan(voucher.slogan)
  }

  const updateVoucher = async () => {
    if (!discount || !slogan || !editingVoucher) return
    
    const newCode = generateUniqueCode()
    
    try {
      const response = await fetch(`/api/vouchers?id=${editingVoucher}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode, discount: Number(discount), slogan })
      })
      
      if (response.ok) {
        setDiscount('')
        setSlogan('')
        setEditingVoucher(null)
        fetchVouchers()
      }
    } catch (error) {
      console.error('Error updating voucher:', error)
    }
  }

  const cancelVoucherEdit = () => {
    setEditingVoucher(null)
    setDiscount('')
    setSlogan('')
  }

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/time-slots')
      const data = await response.json()
      if (data.success) {
        setTimeSlots(data.data)
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    }
  }

  const addTimeSlot = async () => {
    if (!slotTime || !slotType) return
    
    try {
      const response = await fetch('/api/time-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: slotTime, type: slotType })
      })
      
      if (response.ok) {
        setSlotTime('')
        setSlotType('pickup')
        fetchTimeSlots()
      }
    } catch (error) {
      console.error('Error adding time slot:', error)
    }
  }

  const removeTimeSlot = async (id: string) => {
    try {
      const response = await fetch(`/api/time-slots?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchTimeSlots()
      }
    } catch (error) {
      console.error('Error removing time slot:', error)
    }
  }

  const editTimeSlot = (slot: any) => {
    setEditingSlot(slot._id)
    setSlotTime(slot.time)
    setSlotType(slot.type)
  }

  const updateTimeSlot = async () => {
    if (!slotTime || !slotType || !editingSlot) return
    
    try {
      const response = await fetch(`/api/time-slots?id=${editingSlot}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: slotTime, type: slotType })
      })
      
      if (response.ok) {
        setSlotTime('')
        setSlotType('pickup')
        setEditingSlot(null)
        fetchTimeSlots()
      }
    } catch (error) {
      console.error('Error updating time slot:', error)
    }
  }

  const cancelEdit = () => {
    setEditingSlot(null)
    setSlotTime('')
    setSlotType('pickup')
  }

  const handleDragStart = (e: any, slot: any) => {
    setDraggedItem(slot)
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleDrop = async (e: any, targetSlot: any) => {
    e.preventDefault()
    if (!draggedItem || draggedItem._id === targetSlot._id) return

    const newTimeSlots = [...timeSlots]
    const draggedIndex = newTimeSlots.findIndex(slot => slot._id === draggedItem._id)
    const targetIndex = newTimeSlots.findIndex(slot => slot._id === targetSlot._id)

    newTimeSlots.splice(draggedIndex, 1)
    newTimeSlots.splice(targetIndex, 0, draggedItem)

    setTimeSlots(newTimeSlots)
    setDraggedItem(null)

    // Update order in database
    try {
      const slotsWithOrder = newTimeSlots.map((slot, index) => ({
        id: slot._id,
        order: index
      }))
      
      await fetch('/api/time-slots/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: slotsWithOrder })
      })
    } catch (error) {
      console.error('Error updating slot order:', error)
      fetchTimeSlots() // Revert on error
    }
  }

  return (
    <ResponsiveLayout activePage="Add-On" title="Add-On Management">
      <div style={{ padding: '1.5rem' }}>
        {/* Header Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => {
              setActiveSection('Pincode')
              window.location.hash = 'Pincode'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Pincode' ? '#2563eb' : 'white', 
              color: activeSection === 'Pincode' ? 'white' : '#2563eb', 
              border: activeSection === 'Pincode' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Pincode
          </button>
          <button 
            onClick={() => {
              setActiveSection('Voucher')
              window.location.hash = 'Voucher'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Voucher' ? '#2563eb' : 'white', 
              color: activeSection === 'Voucher' ? 'white' : '#2563eb', 
              border: activeSection === 'Voucher' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Voucher
          </button>
          <button 
            onClick={() => {
              setActiveSection('TimeSlot')
              window.location.hash = 'TimeSlot'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'TimeSlot' ? '#2563eb' : 'white', 
              color: activeSection === 'TimeSlot' ? 'white' : '#2563eb', 
              border: activeSection === 'TimeSlot' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Time Slot
          </button>
          <button 
            onClick={() => {
              setActiveSection('Wallet')
              window.location.hash = 'Wallet'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Wallet' ? '#2563eb' : 'white', 
              color: activeSection === 'Wallet' ? 'white' : '#2563eb', 
              border: activeSection === 'Wallet' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Wallet Points
          </button>
          <button 
            onClick={() => {
              setActiveSection('Hub')
              window.location.hash = 'Hub'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Hub' ? '#2563eb' : 'white', 
              color: activeSection === 'Hub' ? 'white' : '#2563eb', 
              border: activeSection === 'Hub' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Hub
          </button>
          <button 
            onClick={() => {
              setActiveSection('Hero')
              window.location.hash = 'Hero'
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Hero' ? '#2563eb' : 'white', 
              color: activeSection === 'Hero' ? 'white' : '#2563eb', 
              border: activeSection === 'Hero' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Hero Section
          </button>
        </div>

        {/* Pincode Management Section */}
        {activeSection === 'Pincode' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Pincode Management</h3>
          
          {/* Auto-Fetch Section */}
          <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>🔄 Auto-Fetch from API</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <select 
                value={selectedState} 
                onChange={handleStateChange}
                style={{ padding: '0.75rem', border: '1px solid #0ea5e9', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              >
                <option value="">Select State</option>
                {states.map((state: any) => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
              
              <select 
                value={selectedCity} 
                onChange={handleCityChange}
                disabled={!selectedState}
                style={{ padding: '0.75rem', border: '1px solid #0ea5e9', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              >
                <option value="">Select City</option>
                {cities.map((city: string) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <select 
                value={selectedPincode ? JSON.stringify({pincode: selectedPincode, area: selectedArea}) : ''} 
                onChange={handlePincodeChange}
                disabled={!selectedCity}
                style={{ padding: '0.75rem', border: '1px solid #0ea5e9', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              >
                <option value="">Select Pincode</option>
                {pincodes.map((pincode: any) => (
                  <option key={pincode.pincode} value={JSON.stringify(pincode)}>
                    {pincode.pincode} - {pincode.area}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={addServiceableArea}
                disabled={!selectedPincode}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: selectedPincode ? '#0ea5e9' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  cursor: selectedPincode ? 'pointer' : 'not-allowed'
                }}
              >
                Add Area
              </button>
            </div>
          </div>

          {/* Manual Entry Section */}
          <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#92400e', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>✍️ Manual Entry</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="State Code (e.g., WB)"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value.toUpperCase())}
                style={{ padding: '0.75rem', border: '1px solid #f59e0b', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              />
              <input 
                type="text" 
                placeholder="City Name"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #f59e0b', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              />
              <input 
                type="text" 
                placeholder="Pincode"
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                style={{ padding: '0.75rem', border: '1px solid #f59e0b', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              />
              <input 
                type="text" 
                placeholder="Area Name"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #f59e0b', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white' }}
              />
              <button 
                onClick={addServiceableArea}
                disabled={!selectedState || !selectedCity || !selectedPincode || !selectedArea}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: (selectedState && selectedCity && selectedPincode && selectedArea) ? '#f59e0b' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  cursor: (selectedState && selectedCity && selectedPincode && selectedArea) ? 'pointer' : 'not-allowed'
                }}
              >
                Add Manually
              </button>
            </div>
          </div>
          
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>📍 Serviceable Areas ({serviceableAreas.length})</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem' }}>
            {serviceableAreas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No serviceable areas added yet</p>
            ) : (
              serviceableAreas.map((area: any) => (
                <div key={area._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {area.pincode} - {area.area}, {area.city}, {area.state}
                  </span>
                  <button 
                    onClick={() => removeServiceableArea(area._id)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Voucher Management Section */}
        {activeSection === 'Voucher' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Voucher Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="number" 
              placeholder="Discount % (Backend Only)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
            <input 
              type="text" 
              placeholder="Customer Display Text (e.g., Save 20% — New users)"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#dcfce7', border: '1px solid #4ade80', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
            {editingVoucher ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={updateVoucher}
                  disabled={!discount || !slogan}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: discount && slogan ? '#10b981' : '#9ca3af', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    cursor: discount && slogan ? 'pointer' : 'not-allowed',
                    flex: 1
                  }}
                >
                  Update Voucher
                </button>
                <button 
                  onClick={cancelVoucherEdit}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={addVoucher}
                disabled={!discount || !slogan}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: discount && slogan ? '#2563eb' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  cursor: discount && slogan ? 'pointer' : 'not-allowed'
                }}
              >
                Add Voucher
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.5rem' }}>
            {vouchers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', width: '100%' }}>No vouchers created yet</p>
            ) : (
              vouchers.map((voucher: any) => (
                <div key={voucher._id} style={{ 
                  backgroundColor: '#dbeafe',
                  borderRadius: '16px',
                  padding: '1rem',
                  minWidth: '280px',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem', color: '#1e40af', margin: '0 0 0.25rem 0' }}>
                      {voucher.slogan}
                    </h3>
                    <p style={{ color: '#3b82f6', fontSize: '0.875rem', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                      Limited time offer
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem', margin: '0 0 0.25rem 0' }}>
                      Admin: {voucher.discount}% discount
                    </p>
                    <p style={{ color: '#059669', fontSize: '0.75rem', marginBottom: '0.5rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                      Code: {voucher.code}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button 
                        onClick={() => editVoucher(voucher)}
                        style={{
                          width: '80px',
                          height: '32px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => removeVoucher(voucher._id)}
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          backgroundColor: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Time Slot Management Section */}
        {activeSection === 'TimeSlot' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Time Slot Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Time Slot (e.g., 9-11 AM)"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
            <select 
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="pickup">Pickup Slot</option>
              <option value="delivery">Delivery Slot</option>
              <option value="both">Both</option>
            </select>
            {editingSlot ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={updateTimeSlot}
                  disabled={!slotTime || !slotType}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: slotTime && slotType ? '#10b981' : '#9ca3af', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    cursor: slotTime && slotType ? 'pointer' : 'not-allowed',
                    flex: 1
                  }}
                >
                  Update
                </button>
                <button 
                  onClick={cancelEdit}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem', 
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={addTimeSlot}
                disabled={!slotTime || !slotType}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: slotTime && slotType ? '#2563eb' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  cursor: slotTime && slotType ? 'pointer' : 'not-allowed'
                }}
              >
                Add Time Slot
              </button>
            )}
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem' }}>
            {timeSlots.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No time slots created yet</p>
            ) : (
              timeSlots.map((slot: any) => (
                <div 
                  key={slot._id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, slot)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '0.75rem', 
                    backgroundColor: editingSlot === slot._id ? '#dbeafe' : '#f8fafc', 
                    borderRadius: '6px', 
                    marginBottom: '0.5rem',
                    cursor: 'move',
                    border: editingSlot === slot._id ? '2px solid #2563eb' : '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', color: '#6b7280' }}>⋮⋮</span>
                    <span style={{ fontSize: '0.9rem' }}>
                      {slot.time} - {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => editTimeSlot(slot)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => removeTimeSlot(slot._id)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Wallet Points Configuration Section */}
        {activeSection === 'Wallet' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2563eb' }}>Wallet Points Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Points Per Rupee</label>
              <input
                type="number"
                value={walletSettings.pointsPerRupee}
                onChange={(e) => setWalletSettings({...walletSettings, pointsPerRupee: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>₹1 = {walletSettings.pointsPerRupee} points</p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Minimum Redeem Points</label>
              <input
                type="number"
                value={walletSettings.minRedeemPoints}
                onChange={(e) => setWalletSettings({...walletSettings, minRedeemPoints: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Referral Bonus Points</label>
              <input
                type="number"
                value={walletSettings.referralPoints}
                onChange={(e) => setWalletSettings({...walletSettings, referralPoints: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Order Completion Points</label>
              <input
                type="number"
                value={walletSettings.orderCompletionPoints}
                onChange={(e) => setWalletSettings({...walletSettings, orderCompletionPoints: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Signup Bonus Points (Referred User)</label>
              <input
                type="number"
                value={walletSettings.signupBonusPoints}
                onChange={(e) => setWalletSettings({...walletSettings, signupBonusPoints: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>Points given to new user who signs up with referral code</p>
            </div>
          </div>
          <button
            onClick={saveWalletSettings}
            style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Save Settings
          </button>
        </div>
        )}

        {/* Hub Management Section */}
        {activeSection === 'Hub' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Hub Management</h3>
          
          <form onSubmit={addHub} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input placeholder="Hub Name" value={hubForm.name} onChange={(e) => setHubForm({...hubForm, name: e.target.value})} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <input placeholder="Street" value={hubForm.address.street} onChange={(e) => setHubForm({...hubForm, address: {...hubForm.address, street: e.target.value}})} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <select value={hubState} onChange={(e) => { handleHubStateChange(e.target.value); setHubForm({...hubForm, address: {...hubForm.address, state: e.target.value}}); }} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <option value="">Select State</option>
                {[...new Set(serviceableAreas.map((a: any) => a.state))].map((state: string) => <option key={state} value={state}>{state}</option>)}
              </select>
              <select value={hubCity} onChange={(e) => { handleHubCityChange(e.target.value); setHubForm({...hubForm, address: {...hubForm.address, city: e.target.value}}); }} disabled={!hubState} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <option value="">Select City</option>
                {hubCities.map((city: string) => <option key={city} value={city}>{city}</option>)}
              </select>
              <select value={hubForm.address.pincode} onChange={(e) => setHubForm({...hubForm, address: {...hubForm.address, pincode: e.target.value}})} disabled={!hubCity} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <option value="">Select Hub Pincode</option>
                {hubPincodes.map((p: any) => <option key={p.pincode} value={p.pincode}>{p.pincode} - {p.area}</option>)}
              </select>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Service Pincodes (select multiple)</label>
                <select multiple value={selectedServicePincodes} onChange={(e) => setSelectedServicePincodes(Array.from(e.target.selectedOptions, option => option.value))} disabled={!hubCity} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '100%', minHeight: '100px' }}>
                  {hubPincodes.map((p: any) => <option key={p.pincode} value={p.pincode}>{p.pincode} - {p.area}</option>)}
                </select>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>Hold Ctrl/Cmd to select multiple pincodes</p>
              </div>
              <input placeholder="Contact Person" value={hubForm.contactPerson} onChange={(e) => setHubForm({...hubForm, contactPerson: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              <input placeholder="Contact Number" value={hubForm.contactNumber} onChange={(e) => setHubForm({...hubForm, contactNumber: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%' }}>Add Hub</button>
          </form>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {hubs.map((hub) => (
              <div key={hub._id} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{hub.name}</h4>
                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>📍 {hub.address.street}, {hub.address.city}, {hub.address.state} - {hub.address.pincode}</p>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>Service Pincodes: {hub.pincodes.join(', ')}</p>
                {hub.contactPerson && <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>Contact: {hub.contactPerson} - {hub.contactNumber}</p>}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Hero Section Management */}
        {activeSection === 'Hero' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Hero Section Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Upload File</label>
              <input 
                type="file" 
                accept="image/*,video/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Or Enter URL</label>
              <input 
                type="text" 
                placeholder="Image/Video URL"
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Type</label>
              <select 
                value={heroType}
                onChange={(e) => setHeroType(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', width: '100%' }}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>&nbsp;</label>
              <button 
                onClick={addHeroItem}
                disabled={(!heroUrl && !heroFile) || uploading}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: (heroUrl || heroFile) && !uploading ? '#2563eb' : '#9ca3af', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  cursor: (heroUrl || heroFile) && !uploading ? 'pointer' : 'not-allowed',
                  width: '100%'
                }}
              >
                {uploading ? 'Uploading...' : 'Add Item'}
              </button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {heroItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No hero items added yet</p>
            ) : (
              heroItems.map((item: any) => (
                <div key={item._id} style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    {item.type === 'image' ? (
                      <img src={item.url} alt="Hero" style={{ width: '150px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <video src={item.url} style={{ width: '150px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Type: {item.type}</p>
                    </div>
                    <button 
                      onClick={() => removeHeroItem(item._id)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        height: 'fit-content'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
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