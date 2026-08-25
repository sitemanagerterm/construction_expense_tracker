import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AlertCircle, Check, Lock } from "lucide-react";
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import fs from "fs";
import path from "path";

export default async function ExpiredPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.tenantId) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: {
      subscriptionExpiry: true,
      mobileNo: true,
      contactPerson: true,
    },
  });

  // Fetch user's mobile number - try by ID first, fallback to email match
  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(session.user.email ? [{ email: session.user.email }] : []),
      ],
    },
    select: { mobileNumber: true, name: true },
  });

  // Prefill info for Razorpay checkout
  const prefillName = tenant?.contactPerson || dbUser?.name || session.user.name || 'User';
  const prefillEmail = session.user.email || '';
  // Use tenant business mobile first, then user's personal mobile
  const prefillContact = tenant?.mobileNo || dbUser?.mobileNumber || '';

  // DEBUG: Log to server console to verify DB values
  console.log('[Razorpay Prefill]', { prefillName, prefillEmail, prefillContact, tenantMobile: tenant?.mobileNo, userMobile: dbUser?.mobileNumber });

  // Compute the correct Razorpay public key server-side (reliable env var access)
  const isSandbox = process.env.PAYMENT_MODE === 'sandbox';
  const razorpayKeyId = isSandbox
    ? (process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || '')
    : (process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID || '');

  // Read logo as base64 for Razorpay modal (works on localhost too)
  let merchantLogo = '';
  try {
    const logoPath = path.join(process.cwd(), 'public', 'icon-192x192.png');
    const logoBuffer = fs.readFileSync(logoPath);
    merchantLogo = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch {
    // fallback: no logo
  }

  console.log('[Razorpay] Mode:', isSandbox ? 'TEST' : 'LIVE', '| Key:', razorpayKeyId);

  if (tenant?.subscriptionExpiry && new Date(tenant.subscriptionExpiry) >= new Date()) {
    redirect("/dashboard"); // Redirect back if they renewed
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col p-6 sm:px-12 sm:py-10 overflow-y-auto">
      {/* Flowing Header with Logo & Logout */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
        <Image
          src="/mysitebook-logo-dark.png"
          alt="MySiteBook"
          width={320}
          height={80}
          className="h-14 sm:h-20 w-auto object-contain"
          priority
        />
        <LogoutButton />
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side: Messaging */}
        <div className="flex flex-col text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-expense/10 text-expense rounded-full text-xs font-black uppercase tracking-widest mb-3 w-fit mx-auto lg:mx-0 shadow-sm border border-expense/20">
            <AlertCircle className="w-4 h-4" />
            Action Required
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tight mb-6 leading-[1.15]">
            Your workspace is <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-600">currently locked.</span>
          </h1>
          <p className="text-brandtext-secondary text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
            Your subscription period has ended. Renew your plan today to instantly restore access to all your projects, expenses, and financial reports.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4 text-brandtext font-bold text-lg">
              <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              Uninterrupted access to your workspace
            </div>
            <div className="flex items-center gap-4 text-brandtext font-bold text-lg">
              <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              All data and history preserved safely
            </div>
            <div className="flex items-center gap-4 text-brandtext font-bold text-lg">
              <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              Premium customer support included
            </div>
          </div>
        </div>

        {/* Right Side: Pricing Card */}
        <div className="relative max-w-md w-full mx-auto lg:ml-auto lg:mr-0">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/20 blur-3xl -z-10 rounded-[3rem] translate-y-8 scale-95 opacity-70"></div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl ring-1 ring-primary/5 relative overflow-hidden">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>

            <div className="mb-10 text-center">
              <div className="inline-block bg-primary-50 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-lg mb-6">Professional Plan</div>
              <div className="flex items-start justify-center gap-1 mb-2">
                <span className="text-xl font-bold text-brandtext-light mt-2">₹</span>
                <span className="text-6xl font-black text-primary tracking-tighter">299</span>
              </div>
              <p className="text-base text-brandtext-secondary font-bold">per month</p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="h-px w-full bg-slate-100"></div>
              <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-4 border border-primary-100">
                <div className="w-12 h-12 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-primary">Secure Checkout</p>
                  <p className="text-xs text-primary-500 font-bold mt-0.5">Powered by Razorpay</p>
                </div>
              </div>
            </div>

            <RazorpayCheckoutButton
              amount={29900}
              buttonText="Renew Plan Now"
              className="w-full bg-primary hover:bg-primary-800 text-white font-black py-4 px-8 rounded-2xl transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2"
              redirectUrl="/dashboard"
              razorpayKeyId={razorpayKeyId}
              merchantLogo={merchantLogo}
              merchantName="MySiteBook"
              merchantDescription="Pro Plan – Monthly Subscription · ₹299/month"
              prefillName={prefillName}
              prefillEmail={prefillEmail}
              prefillContact={prefillContact}
            />

            <p className="text-center text-xs text-brandtext-light font-semibold mt-6 px-4">
              By renewing, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
