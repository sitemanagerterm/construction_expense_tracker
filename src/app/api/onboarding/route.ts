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

    const { companyName, mobile, businessType, contactPerson, address, pincode } = await req.json();

    if (!companyName || !mobile || !contactPerson) {
      return NextResponse.json(
        { error: "Company name, contact person, and mobile number are required" },
        { status: 400 }
      );
    }

    // Calculate 30-day expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    // Get max staff limit from env, default to 1
    const staffLimit = parseInt(process.env.DEFAULT_MAX_STAFF || "1", 10);

    // Use a transaction to ensure both Tenant and User are updated atomically
    const tenant = await prisma.$transaction(async (tx: any) => {
      // Create the Tenant with Free Trial and new fields
      const newTenant = await tx.tenant.create({
        data: {
          name: companyName,
          businessType: businessType || "other",
          contactPerson,
          mobileNo: mobile,
          address,
          pincode,
          staffLimit,
          subscriptionTier: "TRIAL",
          subscriptionExpiry: expiryDate,
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

      // Create default roles
      await tx.tenantRole.createMany({
        data: [
          {
            tenantId: newTenant.id,
            name: "Basic Control",
            description: "Default role with basic expense tracking",
            permissions: JSON.stringify(["dashboard.view", "expenses.view", "expenses.add"]),
            isDefault: true,
          },
          {
            tenantId: newTenant.id,
            name: "Advanced Control",
            description: "Default role with project and credit tracking",
            permissions: JSON.stringify(["dashboard.view", "projects.view", "expenses.view", "expenses.add", "credits.view", "credits.add"]),
            isDefault: true,
          },
          {
            tenantId: newTenant.id,
            name: "Full Control",
            description: "Default master role with full access",
            permissions: JSON.stringify([
              "dashboard.view", 
              "projects.view", "projects.add", "projects.edit", "projects.delete", 
              "expenses.view", "expenses.add", "expenses.edit", "expenses.delete", 
              "credits.view", "credits.add", "credits.edit", "credits.delete", 
              "staff.view", "staff.add", "staff.edit", "staff.delete", 
              "audit_log.view", 
              "settings.view", "settings.edit"
            ]),
            isDefault: true,
          }
        ]
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
