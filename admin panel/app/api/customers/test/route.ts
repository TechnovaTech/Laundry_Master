import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function POST() {
  try {
    await connectDB()
    
    const testCustomer = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test Customer',
      email: 'test@customer.com',
      phone: '1234567890'
    }
    
    const existingCustomer = await Customer.findById(testCustomer._id)
    if (existingCustomer) {
      return NextResponse.json({ message: 'Test customer already exists', customer: existingCustomer })
    }
    
    const customer = new Customer(testCustomer)
    await customer.save()
    
    return NextResponse.json({ message: 'Test customer created', customer })
  } catch (error) {
    console.error('Error creating test customer:', error)
    return NextResponse.json({ error: 'Failed to create test customer' }, { status: 500 })
  }
}