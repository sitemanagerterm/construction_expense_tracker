"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifySuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function getTenants() {
  await verifySuperAdmin();
  
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        id: { not: 'super-admin-tenant' }
      },
      include: {
        users: {
          select: { role: true, email: true, isBlocked: true }
        },
        paymentHistory: {
          orderBy: { paymentDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedTenants = tenants.map(t => {
      const owner = t.users.find(u => u.role === "OWNER");
      const activeStaff = t.users.filter(u => u.role === "STAFF" && !u.isBlocked).length;
      return {
        id: t.id,
        name: t.name,
        currency: t.currency,
        staffLimit: t.staffLimit,
        activeStaff,
        ownerEmail: owner?.email || "N/A",
        businessType: t.businessType || "N/A",
        contactPerson: t.contactPerson || "N/A",
        mobileNo: t.mobileNo || "N/A",
        address: t.address || "N/A",
        pincode: t.pincode || "N/A",
        language: t.language || "N/A",
        createdAt: t.createdAt,
        subscriptionTier: t.subscriptionTier,
        subscriptionExpiry: t.subscriptionExpiry,
        payments: t.paymentHistory
      };
    });

    return { success: true, tenants: formattedTenants };
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    return { success: false, error: "Failed to fetch tenants" };
  }
}

export async function updateTenantStaffLimit(tenantId: string, newLimit: number) {
  await verifySuperAdmin();
  
  if (newLimit < 1) {
    return { success: false, error: "Staff limit must be at least 1." };
  }

  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { staffLimit: newLimit }
    });
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update staff limit:", error);
    return { success: false, error: "Failed to update staff limit" };
  }
}

export async function getDashboardMetrics() {
  await verifySuperAdmin();
  try {
    const totalTenants = await prisma.tenant.count({
      where: { id: { not: 'super-admin-tenant' } }
    });
    
    // Find tenants expiring in the next 14 days
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    
    const expiringSoon = await prisma.tenant.count({
      where: {
        id: { not: 'super-admin-tenant' },
        subscriptionExpiry: {
          not: null,
          lte: twoWeeksFromNow,
          gte: new Date()
        }
      }
    });

    // Fallback in case Prisma client hasn't been regenerated yet and subscriptionPlan is undefined
    let activePlans = 0;
    if (prisma.subscriptionPlan) {
      activePlans = await prisma.subscriptionPlan.count({ where: { isActive: true } });
    }

    const activeTenants = await prisma.tenant.count({
      where: {
        id: { not: 'super-admin-tenant' },
        subscriptionExpiry: { gt: new Date() }
      }
    });

    const totalUsers = await prisma.user.count({
      where: { role: { not: "SUPER_ADMIN" } }
    });

    let totalRevenue = 0;
    if (prisma.paymentHistory) {
      const revenueAggr = await prisma.paymentHistory.aggregate({
        _sum: { amount: true }
      });
      totalRevenue = revenueAggr._sum.amount || 0;
    }

    return { success: true, metrics: { totalTenants, expiringSoon, activePlans, activeTenants, totalUsers, totalRevenue } };
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
}

export async function getSubscriptionPlans() {
  await verifySuperAdmin();
  try {
    let plans: any[] = [];
    if (prisma.subscriptionPlan) {
      plans = await prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } });
    }
    return { success: true, plans };
  } catch (error) {
    return { success: false, error: "Failed to fetch plans" };
  }
}

export async function createSubscriptionPlan(data: any) {
  await verifySuperAdmin();
  try {
    if (!prisma.subscriptionPlan) {
      return { success: false, error: "Database update pending. Please restart your Next.js server!" };
    }
    await prisma.subscriptionPlan.create({ data });
    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create plan" };
  }
}

export async function updateSubscriptionPlan(id: string, data: any) {
  await verifySuperAdmin();
  try {
    if (!prisma.subscriptionPlan) {
      return { success: false, error: "Database update pending. Please restart your Next.js server!" };
    }
    await prisma.subscriptionPlan.update({
      where: { id },
      data
    });
    revalidatePath("/admin/plans");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update plan" };
  }
}

export async function getPlatformSettings() {
  await verifySuperAdmin();
  try {
    let settings = null;
    if (prisma.platformSettings) {
      settings = await prisma.platformSettings.findFirst();
      if (!settings) {
        settings = await prisma.platformSettings.create({ data: {} });
      }
    }
    return { success: true, settings: settings || {} };
  } catch (error) {
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function updatePlatformSettings(data: any) {
  await verifySuperAdmin();
  try {
    const settings = await prisma.platformSettings.findFirst();
    if (settings) {
      await prisma.platformSettings.update({ where: { id: settings.id }, data });
    } else {
      await prisma.platformSettings.create({ data });
    }
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update settings" };
  }
}

export async function renewTenantSubscription(tenantId: string, planId: string, amountPaid: number, method: string) {
  await verifySuperAdmin();
  try {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return { success: false, error: "Plan not found" };

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return { success: false, error: "Tenant not found" };

    const now = new Date();
    let newExpiry = tenant.subscriptionExpiry && tenant.subscriptionExpiry > now ? new Date(tenant.subscriptionExpiry) : now;
    newExpiry.setMonth(newExpiry.getMonth() + plan.durationMonths);

    await prisma.$transaction([
      prisma.tenant.update({
        where: { id: tenantId },
        data: { subscriptionTier: plan.name, subscriptionExpiry: newExpiry }
      }),
      prisma.paymentHistory.create({
        data: {
          tenantId,
          amount: amountPaid,
          method,
          planType: plan.name,
          notes: "Manual renewal by Super Admin"
        }
      })
    ]);

    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error) {
    console.error("Renewal failed:", error);
    return { success: false, error: "Failed to process renewal" };
  }
}

export async function getPaymentHistory() {
  await verifySuperAdmin();
  try {
    const history = await prisma.paymentHistory.findMany({
      include: {
        tenant: {
          select: { name: true }
        }
      },
      orderBy: { paymentDate: 'desc' }
    });
    return { success: true, history };
  } catch (error) {
    return { success: false, error: "Failed to fetch payment history" };
  }
}

export async function changeSuperAdminPassword(currentPassword: string, newPassword: string) {
  await verifySuperAdmin();
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Not logged in" };
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "SUPER_ADMIN") return { success: false, error: "Unauthorized" };
    
    const bcrypt = require("bcryptjs");
    if (!user.password) return { success: false, error: "No password set" };
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { success: false, error: "Current password is incorrect" };
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Failed to change password" };
  }
}

export async function getContactMessages() {
  await verifySuperAdmin();
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, messages };
  } catch (error) {
    return { success: false, error: "Failed to fetch contact messages" };
  }
}

export async function markContactMessageAsRead(id: string) {
  await verifySuperAdmin();
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: "READ" }
    });
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update message" };
  }
}

export async function deleteContactMessage(id: string) {
  await verifySuperAdmin();
  try {
    await prisma.contactMessage.delete({
      where: { id }
    });
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete message" };
  }
}
