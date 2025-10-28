import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import ServiceableArea from '../../../models/ServiceableArea'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pincode = searchParams.get('pincode')
  
  console.log('Checking pincode:', pincode)
  
  if (!pincode) {
    return NextResponse.json({ error: 'Pincode is required' }, { status: 400 })
  }
  
  try {
    await dbConnect()
    console.log('Database connected')
    
    const area = await ServiceableArea.findOne({ pincode: pincode.toString(), isActive: true })
    console.log('Found area:', area)
    
    return NextResponse.json({ 
      serviceable: !!area,
      area: area ? { city: area.city, state: area.state, area: area.area } : null
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to check serviceable area', details: error.message }, { status: 500 })
  }
}