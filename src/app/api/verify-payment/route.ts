import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planDays = 30,       // default 30 days (monthly plan)
      planType = 'MONTHLY',
      amount = 299,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use mode-aware secret key (same logic as create-order)
    const isSandbox = process.env.PAYMENT_MODE === 'sandbox';
    const key_secret = isSandbox
      ? process.env.RAZORPAY_TEST_KEY_SECRET!
      : process.env.RAZORPAY_LIVE_KEY_SECRET!;

    console.log('[Verify Payment] Mode:', isSandbox ? 'TEST' : 'LIVE');

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('[Verify Payment] Signature mismatch');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // ✅ Signature valid — extend subscription (stack from current expiry if still active)
    const session = await getServerSession(authOptions);
    if (session?.user?.tenantId) {
      // Fetch current expiry to decide whether to stack or start fresh
      const tenant = await prisma.tenant.findUnique({
        where: { id: session.user.tenantId },
        select: { subscriptionExpiry: true },
      });

      const now = new Date();
      const currentExpiry = tenant?.subscriptionExpiry ? new Date(tenant.subscriptionExpiry) : null;

      // If subscription is still active → stack days on top of current expiry
      // If expired or no subscription → start from today
      const baseDate = (currentExpiry && currentExpiry > now) ? currentExpiry : now;
      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + planDays);

      console.log(`[Verify Payment] Base: ${baseDate.toISOString()} + ${planDays} days → New expiry: ${newExpiry.toISOString()}`);

      await Promise.all([
        prisma.tenant.update({
          where: { id: session.user.tenantId },
          data: { subscriptionExpiry: newExpiry },
        }),
        prisma.paymentHistory.create({
          data: {
            tenantId: session.user.tenantId,
            amount,
            currency: 'INR',
            method: 'ONLINE',
            planType,
            transactionReference: razorpay_payment_id,
            notes: `Order: ${razorpay_order_id} | Extended ${planDays} days from ${baseDate.toDateString()}`,
          },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription renewed successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment', details: error?.message }, { status: 500 });
  }
}
