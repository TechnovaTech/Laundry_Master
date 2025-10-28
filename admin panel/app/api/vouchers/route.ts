import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET() {
  try {
    await dbConnect();
    const vouchers = await Voucher.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: vouchers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { code, discount, slogan } = await request.json();
    console.log('Creating voucher:', { code, discount, slogan });
    
    if (!slogan) {
      return NextResponse.json({ success: false, error: 'Slogan is required' }, { status: 400 });
    }
    
    const voucher = await Voucher.create({ code, discount, slogan });
    console.log('Voucher created:', voucher);
    return NextResponse.json({ success: true, data: voucher }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Voucher creation error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create voucher' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { code, discount, slogan } = await request.json();
    
    if (!slogan) {
      return NextResponse.json({ success: false, error: 'Slogan is required' }, { status: 400 });
    }
    
    const voucher = await Voucher.findByIdAndUpdate(id, { code, discount, slogan }, { new: true });
    return NextResponse.json({ success: true, data: voucher });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update voucher' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await Voucher.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete voucher' }, { status: 500 });
  }
}