import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

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
    console.log('Starting login process...')
    await dbConnect()
    console.log('Database connected')
    
    const { mobile } = await request.json()
    console.log('Mobile number received:', mobile)

    let customer = await Customer.findOne({ mobile })
    console.log('Customer found:', customer ? 'Yes' : 'No')
    
    let isExistingUser = false
    
    if (!customer) {
      customer = await Customer.create({
        mobile,
        name: 'User',
        isActive: true
      })
      console.log('New customer created:', customer._id)
    } else {
      isExistingUser = true
      console.log('Existing customer found, redirecting to home')
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('OTP generated:', otp)
    
    return NextResponse.json({
      success: true,
      data: {
        customerId: customer._id,
        otp,
        message: 'OTP sent successfully',
        isExistingUser,
        customer: customer
      }
    })
  } catch (error) {
    console.error('Login API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }, { status: 500 })
  }
}