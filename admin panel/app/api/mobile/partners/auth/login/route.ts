import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Partner login API called')
    await dbConnect()
    console.log('Database connected for partner')
    
    const { mobile } = await request.json()
    console.log('Partner mobile received:', mobile)

    let partner = await Partner.findOne({ mobile })
    console.log('Partner found:', partner ? 'Yes' : 'No')
    
    if (!partner) {
      partner = await Partner.create({
        mobile,
        name: 'Partner',
        isActive: true
      })
      console.log('New partner created:', partner._id)
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('OTP generated for partner:', otp)
    
    return NextResponse.json({
      success: true,
      data: {
        partnerId: partner._id,
        otp,
        message: 'OTP sent successfully',
        isExistingUser: !!partner.name && partner.name !== 'Partner',
        partner: partner
      }
    })
  } catch (error) {
    console.error('Partner login API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }, { status: 500 })
  }
}