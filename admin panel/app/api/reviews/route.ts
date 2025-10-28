import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Customer from '@/models/Customer'
import Order from '@/models/Order'

export async function GET() {
  try {
    await connectDB()
    
    // First try to get reviews without populate to see if any exist
    const reviewCount = await Review.countDocuments()
    console.log('Total reviews in database:', reviewCount)
    
    if (reviewCount === 0) {
      return NextResponse.json([])
    }
    
    // Try with populate, but handle errors gracefully
    const reviews = await Review.find()
      .populate('customerId', 'name email')
      .populate('orderId', 'orderId')
      .sort({ createdAt: -1 })
      .lean()
    
    console.log('Fetched reviews:', reviews.length)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    
    // Try to get reviews without populate as fallback
    try {
      const reviews = await Review.find().sort({ createdAt: -1 }).lean()
      console.log('Fallback: fetched reviews without populate:', reviews.length)
      return NextResponse.json(reviews)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { orderId, customerId, rating, comment } = await request.json()
    
    if (!orderId || !customerId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const review = new Review({ 
      orderId, 
      customerId, 
      rating: Number(rating), 
      comment,
      status: 'pending'
    })
    
    const savedReview = await review.save()
    console.log('Review saved:', savedReview)
    
    return NextResponse.json(savedReview, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}