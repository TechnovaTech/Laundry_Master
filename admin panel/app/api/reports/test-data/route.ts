import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'

export async function POST() {
  try {
    await connectDB()
    
    // Create test customers
    const customers = []
    for (let i = 1; i <= 5; i++) {
      const customer = new Customer({
        name: `Customer ${i}`,
        email: `customer${i}@test.com`,
        phone: `123456789${i}`
      })
      const savedCustomer = await customer.save()
      customers.push(savedCustomer._id)
    }
    
    // Create test partners
    const partners = []
    for (let i = 1; i <= 3; i++) {
      const partner = new Partner({
        name: `Partner #P${i}`,
        email: `partner${i}@test.com`,
        phone: `987654321${i}`
      })
      const savedPartner = await partner.save()
      partners.push(savedPartner._id)
    }
    
    // Create test orders with different dates
    const orders = []
    for (let i = 0; i < 20; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)) // Last 7 days
      
      const order = new Order({
        orderId: `ORD${1000 + i}`,
        customerId: customers[Math.floor(Math.random() * customers.length)],
        partnerId: partners[Math.floor(Math.random() * partners.length)],
        items: [{ name: 'Shirt', quantity: 2, price: 50 }],
        totalAmount: Math.floor(Math.random() * 500) + 100,
        status: ['pending', 'delivered', 'processing'][Math.floor(Math.random() * 3)],
        createdAt: date
      })
      
      const savedOrder = await order.save()
      orders.push(savedOrder)
    }
    
    return NextResponse.json({ 
      message: 'Test data created successfully',
      customers: customers.length,
      partners: partners.length,
      orders: orders.length
    })
  } catch (error) {
    console.error('Error creating test data:', error)
    return NextResponse.json({ error: 'Failed to create test data' }, { status: 500 })
  }
}