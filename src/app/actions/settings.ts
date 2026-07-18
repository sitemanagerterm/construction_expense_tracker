"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ProfileFormData = {
  name: string;
  mobileNumber?: string;
};

export async function updateProfile(data: ProfileFormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        mobileNumber: data.mobileNumber || null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

export type TenantSettingsFormData = {
  currency: string;
  language: string;
};

export async function updateTenantSettings(data: TenantSettingsFormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.tenantId) {
      throw new Error("Unauthorized");
    }

    // Only allow OWNER to update tenant settings
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "OWNER" && user?.role !== "ADMIN") {
       throw new Error("Only owners or admins can update application settings.");
    }

    const updated = await prisma.tenant.update({
      where: { id: session.user.tenantId },
      data: {
        currency: data.currency,
        language: data.language,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating tenant settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

export async function updateLanguage(language: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.tenantId) {
      throw new Error("Unauthorized");
    }
    await prisma.tenant.update({
      where: { id: session.user.tenantId },
      data: { language },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating language:", error);
    return { success: false };
  }
}
