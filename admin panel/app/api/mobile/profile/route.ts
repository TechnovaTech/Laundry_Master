import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 })
    }

    const customer = await Customer.findById(customerId).lean()
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Profile creation API called')
    await dbConnect()
    console.log('Database connected')
    
    const body = await request.json()
    console.log('Profile creation data:', body)

    // Check if customer with this mobile already exists
    const existingCustomer = await Customer.findOne({ mobile: body.mobile })
    
    if (existingCustomer) {
      // Update existing customer
      const updatedCustomer = await Customer.findOneAndUpdate(
        { mobile: body.mobile },
        { ...body, updatedAt: new Date() },
        { new: true }
      )
      console.log('Updated existing customer:', updatedCustomer)
      return NextResponse.json({ success: true, data: updatedCustomer })
    } else {
      // Create new customer
      const customerData: any = {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Handle referral code if provided
      if (body.referralCode) {
        customerData.referredBy = body.referralCode
      }
      
      const customer = new Customer(customerData)
      const savedCustomer = await customer.save()
      console.log('Created new customer:', savedCustomer)
      return NextResponse.json({ success: true, data: savedCustomer })
    }
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create profile: ' + error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile update API called')
    await dbConnect()
    console.log('Database connected')
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const body = await request.json()
    
    console.log('Customer ID:', customerId)
    console.log('Update data:', body)

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 })
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    )
    
    console.log('Updated customer:', customer)

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile: ' + error.message }, { status: 500 })
  }
}