'use client';

import { useState } from 'react';
import Script from 'next/script';
import { toast } from 'react-hot-toast';

interface RazorpayCheckoutButtonProps {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  buttonText?: string;
  className?: string;
  redirectUrl?: string;
  razorpayKeyId: string;
  planDays?: number;   // e.g. 30 for monthly, 90 for quarterly, 365 for yearly
  planType?: string;   // e.g. 'MONTHLY', 'QUARTERLY', 'YEARLY'
  prefillName?: string;
  prefillEmail?: string;
  prefillContact?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function RazorpayCheckoutButton({
  amount,
  currency = 'INR',
  receipt = 'receipt_' + Math.random().toString(36).substring(7),
  buttonText = 'Pay Now',
  className = 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50',
  redirectUrl,
  razorpayKeyId,
  planDays = 30,
  planType = 'MONTHLY',
  prefillName = 'User',
  prefillEmail = '',
  prefillContact = '',
  onSuccess,
  onError,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    // DEBUG: confirm what values we received as props
    console.log('[RazorpayCheckoutButton] Props received:', { prefillName, prefillEmail, prefillContact });

    if (amount < 100) {
      const errorMsg = 'Amount must be at least 100 paise';
      toast.error(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt }),
      });
      
      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error(orderData.details || orderData.error || 'Failed to create order');
      }

      // 2. Initialize Razorpay - key passed directly from server (reliable)
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MySiteBook',
        description: 'Subscription Renewal',
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planDays,
                planType,
                amount: Math.round(amount / 100), // convert paise to INR
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast.success('Payment successful!');
              onSuccess?.(response.razorpay_payment_id);
              if (redirectUrl) {
                window.location.href = redirectUrl;
              }
            } else {
              toast.error(verifyData.error || 'Payment verification failed');
              onError?.(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            toast.error('Payment verification failed');
            onError?.('Verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: prefillName,
          email: prefillEmail,
          // Normalize: strip +91 / country code, keep only last 10 digits
          contact: prefillContact
            ? prefillContact.replace(/\D/g, '').slice(-10)
            : '',
        },
        theme: {
          color: '#0A1121',
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
            onError?.('Payment cancelled by user');
            setLoading(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        toast.error(response.error.description);
        onError?.(response.error.description);
      });
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
      onError?.(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className={className}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </>
  );
}
