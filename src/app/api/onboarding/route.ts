import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { companyName, mobile, businessType } = await req.json();

    if (!companyName || !mobile) {
      return NextResponse.json(
        { error: "Company name and mobile number are required" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure both Tenant and User are updated atomically
    const tenant = await prisma.$transaction(async (tx: any) => {
      // Create the Tenant
      const newTenant = await tx.tenant.create({
        data: {
          name: companyName,
          businessType: businessType || "other",
        },
      });

      // Update the user with the new tenantId, mobile, and ensure role is OWNER
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          tenantId: newTenant.id,
          mobileNumber: mobile,
          role: "OWNER",
        },
      });

      return newTenant;
    });

    return NextResponse.json({ success: true, tenant });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
