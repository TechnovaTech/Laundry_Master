import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

export async function POST() {
  try {
    await connectDB()
    
    const testReview = new Review({
      orderId: '507f1f77bcf86cd799439012',
      customerId: '507f1f77bcf86cd799439011', 
      rating: 5,
      comment: 'Great service! Very satisfied.',
      status: 'pending'
    })
    
    const savedReview = await testReview.save()
    console.log('Test review created:', savedReview)
    
    return NextResponse.json({ message: 'Test review created', review: savedReview })
  } catch (error) {
    console.error('Error creating test review:', error)
    return NextResponse.json({ error: 'Failed to create test review' }, { status: 500 })
  }
}