import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClientPage from "./SettingsClientPage";
import { getTenantPlan } from "@/lib/subscription";

export const metadata = {
  title: "Settings | MySiteBook",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  


  let user = null;

  try {
    if (session?.user?.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
          role: true,
          tenantRole: { select: { permissions: true } },
          tenant: {
            select: {
              name: true,
              currency: true,
              language: true,
              contactPerson: true,
              mobileNo: true,
              address: true,
              pincode: true,
              businessType: true,
              bankAccountName: true,
              bankAccountNumber: true,
              bankIfscCode: true,
              bankUpiId: true,
              bankGpayNumber: true,
              subscriptionExpiry: true,
              subscriptionTier: true
            }
          }
        }
      });

    const hasAccess = 
      user?.role === "OWNER" || 
      user?.role === "SUPER_ADMIN" || 
      (user?.role === "STAFF" && user?.tenantRole?.permissions?.includes("settings.view"));

      if (!hasAccess) {
        redirect("/dashboard");
      }
    }
  } catch (err: any) {
    console.error("Settings page error:", err);
    // Ignore and let it render with user = null
  }

  const lang = user?.tenant?.language || "en";
  const { dictionaries } = await import("@/lib/i18n/dictionaries");
  const t = (key: string) => dictionaries[lang]?.[key] || dictionaries["en"][key] || key;

  let roles: any[] = [];
  try {
    if (user?.tenant?.name && session?.user?.tenantId) {
      roles = await prisma.tenantRole.findMany({
        where: { tenantId: session.user.tenantId },
        include: {
          _count: {
            select: { users: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
    }
  } catch (err: any) {
    console.error("Settings error fetching roles:", err);
  }

  const { plan } = session?.user?.tenantId ? await getTenantPlan(session.user.tenantId) : { plan: "FREE" };

  let supportPhone = "";
  let supportEmail = "";
  try {
    const platformSettings = await prisma.platformSettings.findFirst();
    if (platformSettings) {
      supportPhone = platformSettings.supportPhone || "";
      supportEmail = platformSettings.supportEmail || "";
    }
  } catch (err) {
    console.error("Settings error fetching platform settings:", err);
  }

  let billingHistory: any[] = [];
  try {
    if (session?.user?.tenantId) {
      billingHistory = await prisma.paymentHistory.findMany({
        where: { tenantId: session.user.tenantId },
        orderBy: { paymentDate: 'desc' },
        take: 20,
      });
    }
  } catch (err) {
    console.error("Settings error fetching billing history:", err);
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{t('manage_account_desc') || "Manage your account and preferences."}</p>
        </div>
      </div>
      
      {user ? (
        <SettingsClientPage initialUser={user} initialRoles={roles} plan={plan} supportPhone={supportPhone} supportEmail={supportEmail} razorpayKeyId={process.env.PAYMENT_MODE === 'sandbox' ? (process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || '') : (process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID || '')} billingHistory={billingHistory} />
      ) : (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl">Error loading user profile.</div>
      )}
    </div>
  );
}
