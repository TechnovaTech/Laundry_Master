import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'
import WalletSettings from '@/models/WalletSettings'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    Partner // Ensure Partner model is registered
    Customer // Ensure Customer model is registered
    
    // Try to find by orderId first, then by _id
    let order = await Order.findOne({ orderId: params.id })
      .populate('customerId', 'name mobile email address')
      .populate('partnerId', 'name mobile email')
    
    if (!order) {
      order = await Order.findById(params.id)
        .populate('customerId', 'name mobile email address')
        .populate('partnerId', 'name mobile email')
    }
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: order
    })
    
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch order'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const updateData = await request.json()
    console.log('PATCH request - Order ID:', params.id)
    console.log('PATCH request - Update data:', updateData)
    
    const currentOrder = await Order.findById(params.id).populate('customerId')
    
    // If status is being updated, add to status history
    if (updateData.status) {
      console.log('Current order status:', currentOrder?.status)
      console.log('New status:', updateData.status)
      if (currentOrder) {
        const newHistoryEntry = {
          status: updateData.status,
          timestamp: new Date(),
          updatedBy: updateData.partnerId || 'system'
        }
        updateData.statusHistory = [
          ...(currentOrder.statusHistory || []),
          newHistoryEntry
        ]
        console.log('Adding to statusHistory:', newHistoryEntry)
        console.log('Full statusHistory:', updateData.statusHistory)
      }
    }
    
    // Credit referral points when FIRST order is delivered
    if (updateData.status === 'delivered' && currentOrder?.status !== 'delivered' && currentOrder?.customerId) {
      const customer = await Customer.findById(currentOrder.customerId)
      
      if (customer && customer.referredBy && customer.totalOrders === 0) {
        const settings = await WalletSettings.findOne()
        
        if (settings) {
          // Credit signup bonus to referred user (Customer B)
          await Customer.findByIdAndUpdate(customer._id, {
            $inc: { walletBalance: settings.signupBonusPoints }
          })
          
          // Credit referral bonus to referrer (Customer A)
          const referrer = await Customer.findOne({ 'referralCodes.code': customer.referredBy })
          if (referrer) {
            await Customer.findByIdAndUpdate(referrer._id, {
              $inc: { walletBalance: settings.referralPoints }
            })
          }
        }
      }
      
      // Update total orders count
      await Customer.findByIdAndUpdate(customer._id, {
        $inc: { totalOrders: 1 }
      })
    }
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true, runValidators: false }
    ).populate('partnerId', 'name mobile')
    
    if (!order) {
      console.log('Order not found with ID:', params.id)
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    console.log('Order updated successfully:', order)
    console.log('reachedLocationAt in updated order:', order?.reachedLocationAt)
    console.log('pickedUpAt in updated order:', order?.pickedUpAt)
    return NextResponse.json({
      success: true,
      data: order
    })
    
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const order = await Order.findByIdAndDelete(params.id)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete order'
    }, { status: 500 })
  }
}