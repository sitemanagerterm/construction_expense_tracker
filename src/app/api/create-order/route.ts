import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, receipt } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Invalid amount. Minimum is 100 paise' }, { status: 400 });
    }

    // Dynamically pick keys based on PAYMENT_MODE
    const isSandbox = process.env.PAYMENT_MODE === 'sandbox';
    const key_id = isSandbox
      ? process.env.RAZORPAY_TEST_KEY_ID!
      : process.env.RAZORPAY_LIVE_KEY_ID!;
    const key_secret = isSandbox
      ? process.env.RAZORPAY_TEST_KEY_SECRET!
      : process.env.RAZORPAY_LIVE_KEY_SECRET!;

    console.log(`[Razorpay] Mode: ${isSandbox ? 'TEST' : 'LIVE'} | Key: ${key_id}`);

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({ amount, currency, receipt });

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      error: 'Failed to create order',
      details: error?.message || error?.error?.description || String(error)
    }, { status: 500 });
  }
}
