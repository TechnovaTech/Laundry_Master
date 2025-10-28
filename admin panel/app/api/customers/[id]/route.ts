import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const customer = await Customer.findById(params.id)
    
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const updateData = await request.json()
    
    const customer = await Customer.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    )
    
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: customer })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const customer = await Customer.findByIdAndDelete(params.id)
    
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}