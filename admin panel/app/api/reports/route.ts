import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'

export async function GET() {
  try {
    await connectDB()
    
    // Total Orders
    const totalOrders = await Order.countDocuments()
    
    // Total Revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0
    
    // Active Partners
    const activePartners = await Partner.countDocuments()
    
    // Average Delivery Time (mock for now)
    const avgDeliveryTime = '38 mins'
    
    // Orders Trend (last 7 days)
    const ordersTrend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ])
    
    // Revenue by Day (last 7 days)
    const revenueByDay = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ])
    
    // Partner Performance
    const partnerPerformance = await Order.aggregate([
      { $match: { partnerId: { $exists: true } } },
      {
        $group: {
          _id: '$partnerId',
          deliveries: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'partners',
          localField: '_id',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $sort: { deliveries: -1 } },
      { $limit: 5 }
    ])
    
    // Customer Loyalty Points (mock data)
    const loyaltyData = {
      totalPoints: 50000,
      redeemedPoints: 32500,
      redemptionRate: 65
    }
    
    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        activePartners,
        avgDeliveryTime
      },
      ordersTrend,
      revenueByDay,
      partnerPerformance,
      loyaltyData
    })
  } catch (error) {
    console.error('Error fetching reports data:', error)
    return NextResponse.json({ error: 'Failed to fetch reports data' }, { status: 500 })
  }
}