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
  
  if (!session?.user) {
    return null;
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
