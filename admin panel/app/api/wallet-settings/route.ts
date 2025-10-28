import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import WalletSettings from '@/models/WalletSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await WalletSettings.findOne()
    
    if (!settings) {
      settings = await WalletSettings.create({
        pointsPerRupee: 2,
        minRedeemPoints: 100,
        referralPoints: 50,
        signupBonusPoints: 25,
        orderCompletionPoints: 10
      })
    }
    
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    let settings = await WalletSettings.findOne()
    
    if (settings) {
      settings.pointsPerRupee = body.pointsPerRupee
      settings.minRedeemPoints = body.minRedeemPoints
      settings.referralPoints = body.referralPoints
      settings.signupBonusPoints = body.signupBonusPoints
      settings.orderCompletionPoints = body.orderCompletionPoints
      settings.updatedAt = new Date()
      await settings.save()
    } else {
      settings = await WalletSettings.create(body)
    }
    
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
