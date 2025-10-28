import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import WalletTransaction from '@/models/WalletTransaction'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 })
    }

    const transactions = await WalletTransaction.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({ success: true, data: transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
