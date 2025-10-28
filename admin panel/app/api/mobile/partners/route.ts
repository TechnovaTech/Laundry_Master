import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting partner login process...')
    await dbConnect()
    console.log('Database connected')
    
    const { mobile, name } = await request.json()
    console.log('Partner mobile number received:', mobile)

    let partner = await Partner.findOne({ mobile })
    console.log('Partner found:', partner ? 'Yes' : 'No')
    
    let isExistingUser = false
    
    if (!partner) {
      partner = await Partner.create({
        mobile,
        name: name || 'Partner',
        isActive: true,
        isVerified: false
      })
      console.log('New partner created:', partner._id)
    } else {
      isExistingUser = true
      console.log('Existing partner found')
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('PARTNER OTP generated:', otp)

    return NextResponse.json({
      success: true,
      data: {
        partnerId: partner._id,
        otp,
        message: 'OTP sent successfully',
        isExistingUser,
        partner
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to authenticate partner' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (partnerId) {
      // Fetch single partner
      const partner = await Partner.findById(partnerId)
      if (!partner) {
        return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: partner })
    } else {
      // Fetch all partners
      const partners = await Partner.find({}).sort({ createdAt: -1 })
      return NextResponse.json({ success: true, data: partners })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch partners' }, { status: 500 })
  }
}