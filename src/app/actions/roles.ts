"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type RoleFormData = {
  id?: string;
  name: string;
  description?: string;
  permissions: string[];
};

export async function getTenantRoles() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tenantId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const roles = await prisma.tenantRole.findMany({
      where: { tenantId: session.user.tenantId as string },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    return { success: true, data: roles };
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return { success: false, error: error.message };
  }
}

export async function saveTenantRole(data: RoleFormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tenantId) {
    return { success: false, error: "Unauthorized" };
  }
  
  if (session.user.role !== "OWNER" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only owners can manage roles" };
  }

  try {
    const permissionsString = JSON.stringify(data.permissions);

    if (data.id) {
      // Update existing role
      const existing = await prisma.tenantRole.findFirst({
        where: { id: data.id, tenantId: session.user.tenantId as string }
      });
      
      if (!existing) {
        return { success: false, error: "Role not found" };
      }
      
      if (existing.isDefault) {
        return { success: false, error: "Cannot modify a default system role" };
      }

      await prisma.tenantRole.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description || null,
          permissions: permissionsString,
        }
      });
    } else {
      // Create new role
      await prisma.tenantRole.create({
        data: {
          tenantId: session.user.tenantId as string,
          name: data.name,
          description: data.description || null,
          permissions: permissionsString,
          isDefault: false
        }
      });
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/staff");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error saving role:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTenantRole(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.tenantId) {
    return { success: false, error: "Unauthorized" };
  }
  
  if (session.user.role !== "OWNER" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only owners can manage roles" };
  }

  try {
    const existing = await prisma.tenantRole.findFirst({
      where: { id: id, tenantId: session.user.tenantId as string },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    
    if (!existing) {
      return { success: false, error: "Role not found" };
    }
    
    if (existing.isDefault) {
      return { success: false, error: "Cannot delete a default system role" };
    }
    
    if (existing._count.users > 0) {
      return { success: false, error: "Cannot delete role because users are still assigned to it" };
    }

    await prisma.tenantRole.delete({
      where: { id }
    });

    revalidatePath("/dashboard/settings");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting role:", error);
    return { success: false, error: error.message };
  }
}
