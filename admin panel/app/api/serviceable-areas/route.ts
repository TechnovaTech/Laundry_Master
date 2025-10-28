import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ServiceableArea from '@/models/ServiceableArea'

export async function GET() {
  try {
    await dbConnect()
    
    // Check if any areas exist, if not add some test data
    const count = await ServiceableArea.countDocuments()
    if (count === 0) {
      const testAreas = [
        { state: 'WB', city: 'Kolkata', pincode: '700001', area: 'BBD Bagh', isActive: true },
        { state: 'WB', city: 'Kolkata', pincode: '700016', area: 'Gariahat', isActive: true },
        { state: 'MH', city: 'Mumbai', pincode: '400001', area: 'Fort', isActive: true }
      ]
      await ServiceableArea.insertMany(testAreas)
      console.log('Test data inserted')
    }
    
    const areas = await ServiceableArea.find({ isActive: true })
    return NextResponse.json(areas)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch serviceable areas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { state, city, pincode, area } = await request.json()
    
    const existingArea = await ServiceableArea.findOne({ pincode })
    if (existingArea) {
      return NextResponse.json({ error: 'Pincode already exists' }, { status: 400 })
    }
    
    const serviceableArea = new ServiceableArea({ state, city, pincode, area })
    await serviceableArea.save()
    
    return NextResponse.json(serviceableArea, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add serviceable area' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    await ServiceableArea.findByIdAndDelete(id)
    return NextResponse.json({ message: 'Serviceable area deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete serviceable area' }, { status: 500 })
  }
}