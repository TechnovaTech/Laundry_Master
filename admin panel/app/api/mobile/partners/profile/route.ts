import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (!partnerId) {
      return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 })
    }

    const partner = await Partner.findById(partnerId)
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const existingPartner = await Partner.findOne({ mobile: body.mobile })
    
    if (existingPartner) {
      const updatedPartner = await Partner.findOneAndUpdate(
        { mobile: body.mobile },
        { ...body, updatedAt: new Date() },
        { new: true }
      )
      return NextResponse.json({ success: true, data: updatedPartner })
    } else {
      const partner = new Partner({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      const savedPartner = await partner.save()
      return NextResponse.json({ success: true, data: savedPartner })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create profile: ' + error.message }, { status: 500 })
  }
}