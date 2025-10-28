import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    const review = await Review.findByIdAndDelete(params.id)
    
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}