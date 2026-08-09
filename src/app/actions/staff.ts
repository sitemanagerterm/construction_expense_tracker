"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getTenantPlan } from "@/lib/subscription";

export type StaffFormData = {
  name: string;
  mobileNumber: string;
  pin: string;
  tenantRoleId?: string;
  allocatedProjectIds?: string[];
};

async function getAuthTenant() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("Unauthorized or missing Tenant ID");
  }
  return session.user.tenantId;
}

export async function getStaff() {
  try {
    const tenantId = await getAuthTenant();
    const staff = await prisma.user.findMany({
      where: {
        tenantId,
        role: "STAFF",
      },
      include: {
        tenantRole: { select: { name: true } },
        allocatedProjects: { select: { id: true } }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { staffLimit: true }
    });

    const staffLimit = tenant?.staffLimit || 1;
    const activeStaffCount = staff.filter(s => !s.isBlocked).length;

    return { success: true, data: staff, staffLimit, activeStaffCount };
  } catch (error: any) {
    console.error("Error fetching staff:", error);
    return { success: false, error: error.message };
  }
}

export async function checkMobileNumberExists(mobileNumber: string) {
  try {
    const existing = await prisma.user.findUnique({
      where: { mobileNumber }
    });
    return { success: true, exists: !!existing };
  } catch (error: any) {
    console.error("Error checking mobile number:", error);
    return { success: false, error: error.message };
  }
}

export async function addStaff(data: StaffFormData) {
  try {
    const tenantId = await getAuthTenant();
    
    // Enforce Pro/Free Limits
    const { plan } = await getTenantPlan(tenantId);
    
    if (plan === "FREE") {
      return { success: false, error: "FREE_PLAN_STAFF_RESTRICTED" };
    }
    
    // Check Staff Limit
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { staffLimit: true }
    });

    if (!tenant) throw new Error("Tenant not found");

    const activeStaffCount = await prisma.user.count({
      where: { tenantId, role: "STAFF", isBlocked: false }
    });

    if (activeStaffCount >= tenant.staffLimit) {
      return { success: false, error: `You have reached your limit of ${tenant.staffLimit} active staff members. Please upgrade your plan to add more.` };
    }

    // Check if mobile number already exists globally
    const existing = await prisma.user.findUnique({
      where: { mobileNumber: data.mobileNumber }
    });

    if (existing) {
      return { success: false, error: "This mobile number is already registered in the system." };
    }

    const newStaff = await prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        mobileNumber: data.mobileNumber,
        pin: data.pin,
        role: "STAFF",
        tenantRoleId: data.tenantRoleId || null,
        allocatedProjects: data.allocatedProjectIds && data.allocatedProjectIds.length > 0
          ? { connect: data.allocatedProjectIds.map(id => ({ id })) }
          : undefined,
      },
    });

    revalidatePath("/dashboard/staff");
    return { success: true, data: newStaff };
  } catch (error: any) {
    console.error("Error adding staff:", error);
    return { success: false, error: error.message || "Failed to add staff" };
  }
}

export async function updateStaff(staffId: string, data: StaffFormData) {
  try {
    const tenantId = await getAuthTenant();
    
    // Check if mobile number belongs to someone else
    const existing = await prisma.user.findUnique({
      where: { mobileNumber: data.mobileNumber }
    });

    if (existing && existing.id !== staffId) {
      return { success: false, error: "This mobile number is already registered in the system." };
    }

    const updatedStaff = await prisma.user.update({
      where: { id: staffId, tenantId },
      data: {
        name: data.name,
        mobileNumber: data.mobileNumber,
        pin: data.pin,
        tenantRoleId: data.tenantRoleId || null,
        allocatedProjects: data.allocatedProjectIds
          ? { set: data.allocatedProjectIds.map(id => ({ id })) }
          : undefined,
      },
    });

    revalidatePath("/dashboard/staff");
    return { success: true, data: updatedStaff };
  } catch (error: any) {
    console.error("Error updating staff:", error);
    return { success: false, error: error.message || "Failed to update staff" };
  }
}

export async function deleteStaff(staffId: string) {
  try {
    const tenantId = await getAuthTenant();

    const staff = await prisma.user.findFirst({
      where: { id: staffId, tenantId, role: "STAFF" },
    });

    if (!staff) throw new Error("Staff member not found");

    // Check if staff has any logged expenses
    const expenseCount = await prisma.expense.count({
      where: { userId: staffId }
    });

    if (expenseCount > 0) {
      // Soft Delete (Block) because they have financial records
      await prisma.user.update({
        where: { id: staffId },
        data: { isBlocked: true }
      });
      revalidatePath("/dashboard/staff");
      return { success: true, message: "Staff member blocked. Their past records have been retained." };
    } else {
      // Hard Delete
      await prisma.user.delete({
        where: { id: staffId },
      });
      revalidatePath("/dashboard/staff");
      return { success: true, message: "Staff member permanently removed." };
    }
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleStaffStatus(staffId: string, isBlocked: boolean) {
  try {
    const tenantId = await getAuthTenant();

    // If unblocking, check staff limit first
    if (!isBlocked) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { staffLimit: true }
      });
      
      const activeStaffCount = await prisma.user.count({
        where: { tenantId, role: "STAFF", isBlocked: false }
      });

      if (tenant && activeStaffCount >= tenant.staffLimit) {
        return { success: false, error: `Cannot unblock: You have reached your active staff limit of ${tenant.staffLimit}.` };
      }
    }

    await prisma.user.update({
      where: { id: staffId, tenantId, role: "STAFF" },
      data: { isBlocked }
    });

    revalidatePath("/dashboard/staff");
    return { success: true, message: isBlocked ? "Staff member blocked." : "Staff member unblocked successfully." };
  } catch (error: any) {
    console.error("Error toggling staff status:", error);
    return { success: false, error: error.message };
  }
}
