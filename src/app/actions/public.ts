"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveSubscriptionPlans() {
  try {
    if (!prisma.subscriptionPlan) return { success: true, plans: [] };
    
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
    return { success: true, plans };
  } catch (error) {
    console.error("Failed to fetch public plans:", error);
    return { success: false, plans: [] };
  }
}

export async function getPublicPlatformSettings() {
  try {
    if (!prisma.platformSettings) return { success: true, settings: {} };
    const settings = await prisma.platformSettings.findFirst();
    return { success: true, settings: settings || {} };
  } catch (e) {
    return { success: false, settings: {} };
  }
}
