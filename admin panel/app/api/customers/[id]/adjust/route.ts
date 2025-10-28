import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Customer from '@/models/Customer'
import WalletTransaction from '@/models/WalletTransaction'

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { type, action, amount, reason } = await request.json()

    if (!['balance', 'points'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    }

    if (!['increase', 'decrease'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    }

    const customer = await Customer.findById(params.id)
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { 
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    }

    const field = type === 'balance' ? 'walletBalance' : 'loyaltyPoints'
    const previousValue = customer[field] || 0
    const newValue = action === 'increase' ? previousValue + amount : previousValue - amount

    if (newValue < 0) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    }

    customer[field] = newValue
    customer.lastAdjustmentReason = reason || 'Admin adjustment'
    customer.lastAdjustmentAction = action
    customer.lastAdjustmentAt = new Date()
    customer.updatedAt = new Date()
    await customer.save()

    await WalletTransaction.create({
      customerId: params.id,
      type,
      action,
      amount,
      reason: reason || 'Admin adjustment',
      previousValue,
      newValue
    })

    return NextResponse.json({ success: true, data: customer }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Error adjusting wallet:', error)
    return NextResponse.json({ success: false, error: 'Failed to adjust' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
