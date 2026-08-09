import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PaymentRequestClient from "./PaymentRequestClient";

export const metadata = {
  title: "Payment Request - MySiteBook",
  description: "Generate and share payment requests for your construction projects",
};

export default async function PaymentRequestPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Fetch full user to get tenantRole permissions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tenantRole: true }
  });

  const hasAccess = 
    session.user.role === "OWNER" || 
    session.user.role === "SUPER_ADMIN" || 
    (session.user.role === "STAFF" && user?.tenantRole?.permissions?.includes("payment_requests.view"));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-slate-400">You do not have permission to view payment requests.</p>
      </div>
    );
  }

  // Get tenant to pass currency
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId as string },
    select: { currency: true, name: true }
  });

  return (
    <PaymentRequestClient 
      currency={tenant?.currency || "INR"} 
      tenantName={tenant?.name || "Company"} 
    />
  );
}
