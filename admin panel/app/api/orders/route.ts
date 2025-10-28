import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Customer from '@/models/Customer'
import Partner from '@/models/Partner'
import WalletSettings from '@/models/WalletSettings'
import Hub from '@/models/Hub'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const orderData = await request.json()
    
    // Generate unique 5-character alphanumeric order ID
    const orderId = Math.random().toString(36).substr(2, 5).toUpperCase()
    
    // Find hub based on customer pincode
    let assignedHub = null
    if (orderData.pickupAddress?.pincode) {
      const hub = await Hub.findOne({ 
        pincodes: orderData.pickupAddress.pincode,
        isActive: true 
      })
      if (hub) {
        assignedHub = hub.name
      }
    }
    
    const newOrder = new Order({
      orderId,
      customerId: orderData.customerId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      hub: assignedHub,
      pickupAddress: orderData.pickupAddress,
      deliveryAddress: orderData.deliveryAddress || orderData.pickupAddress,
      pickupSlot: {
        date: orderData.pickupDate || new Date(),
        timeSlot: orderData.pickupSlot
      },
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      specialInstructions: orderData.specialInstructions || '',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    const savedOrder = await newOrder.save()
    
    // Award points to customer and handle referral
    try {
      const settings = await WalletSettings.findOne()
      const pointsToAward = settings?.orderCompletionPoints || 10
      const customer = await Customer.findById(orderData.customerId)
      
      // Award order completion points
      await Customer.findByIdAndUpdate(orderData.customerId, {
        $inc: { loyaltyPoints: pointsToAward, totalOrders: 1 }
      })
      
      // Check if this is first order and customer was referred
      if (customer && customer.totalOrders === 0 && customer.referredBy) {
        // Award signup bonus to new customer
        const signupBonus = settings?.signupBonusPoints || 25
        await Customer.findByIdAndUpdate(orderData.customerId, {
          $inc: { loyaltyPoints: signupBonus }
        })
        
        // Find referrer and award referral points
        const referrer = await Customer.findOne({ 
          'referralCodes.code': customer.referredBy,
          'referralCodes.used': false
        })
        
        if (referrer) {
          const referralBonus = settings?.referralPoints || 50
          await Customer.findByIdAndUpdate(referrer._id, {
            $inc: { loyaltyPoints: referralBonus }
          })
          
          // Mark referral code as used
          await Customer.updateOne(
            { _id: referrer._id, 'referralCodes.code': customer.referredBy },
            { $set: { 'referralCodes.$.used': true, 'referralCodes.$.usedBy': customer.name, 'referralCodes.$.usedAt': new Date() } }
          )
        }
      }
    } catch (error) {
      console.error('Error awarding points:', error)
    }
    
    return NextResponse.json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create order'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    Partner // Ensure Partner model is registered
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const hub = searchParams.get('hub')
    
    let query: any = {}
    if (customerId) {
      query.customerId = customerId
    }
    if (hub) {
      console.log('Filtering orders for hub:', hub)
      // For Store Managers: find hub and get its pincodes, then filter orders
      const hubDoc = await Hub.findOne({ name: hub })
      console.log('Hub found:', hubDoc ? hubDoc.name : 'Not found')
      console.log('Hub pincodes:', hubDoc?.pincodes)
      
      if (hubDoc && hubDoc.pincodes && hubDoc.pincodes.length > 0) {
        query['pickupAddress.pincode'] = { $in: hubDoc.pincodes }
        console.log('Query filter:', query)
      } else {
        // If hub not found or has no pincodes, return empty result
        query._id = null
      }
    }
    
    const orders = await Order.find(query)
      .populate('customerId', 'name mobile email')
      .populate('partnerId', 'name mobile email')
      .sort({ createdAt: -1 })
    
    console.log('Orders found:', orders.length)
    
    return NextResponse.json({
      success: true,
      data: orders
    })
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch orders'
    }, { status: 500 })
  }
}