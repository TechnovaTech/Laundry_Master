import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import ServiceableArea from '../../../models/ServiceableArea'

export async function GET() {
  try {
    await dbConnect()
    
    // Insert test data
    const testArea = new ServiceableArea({
      state: 'WB',
      city: 'Kolkata', 
      pincode: '700001',
      area: 'BBD Bagh',
      isActive: true
    })
    
    await testArea.save()
    
    // Fetch all areas
    const areas = await ServiceableArea.find({})
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected and test data inserted',
      areas: areas
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}