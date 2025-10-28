import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PricingItem from '@/models/PricingItem';

export async function DELETE() {
  try {
    await dbConnect();
    await PricingItem.deleteMany({});
    return NextResponse.json({ success: true, message: 'All items cleared' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to clear items' }, { status: 500 });
  }
}