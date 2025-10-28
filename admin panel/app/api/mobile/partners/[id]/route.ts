import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const partner = await Partner.findById(id).lean()
    
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch partner' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    )
    
    if (!updatedPartner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedPartner })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to update partner' }, { status: 500 })
  }
}
