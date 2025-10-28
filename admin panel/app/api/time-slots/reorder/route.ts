import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import TimeSlot from '@/models/TimeSlot'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { slots } = await request.json()
    
    if (!slots || !Array.isArray(slots)) {
      return NextResponse.json({ success: false, error: 'Slots array is required' }, { status: 400 })
    }
    
    // Update order for each slot
    const updatePromises = slots.map(({ id, order }) => 
      TimeSlot.findByIdAndUpdate(id, { order })
    )
    
    await Promise.all(updatePromises)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to reorder time slots' }, { status: 500 })
  }
}