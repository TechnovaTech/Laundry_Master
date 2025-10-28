import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'
import Order from '@/models/Order'

export async function GET() {
  try {
    await dbConnect()
    const customers = await Customer.find({}).sort({ createdAt: -1 })
    
    // Fetch real order data for each customer
    const customersWithOrderData = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ customerId: customer._id })
        
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        const lastOrder = orders.length > 0 
          ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
          : null
        
        return {
          ...customer.toObject(),
          totalSpent,
          totalOrders: orders.length,
          lastOrderDate: lastOrder?.createdAt || null
        }
      })
    )
    
    return NextResponse.json({ success: true, data: customersWithOrderData })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const customer = await Customer.create(body)
    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 })
  }
}