import { prisma } from "./prisma";

export type PlanType = "FREE" | "PRO";

export async function getTenantPlan(tenantId: string): Promise<{
  plan: PlanType;
  isTrial: boolean;
  isExpired: boolean;
}> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      subscriptionTier: true,
      subscriptionExpiry: true,
    }
  });

  if (!tenant) {
    return { plan: "FREE", isTrial: false, isExpired: true };
  }

  const now = new Date();
  
  if (tenant.subscriptionTier === "TRIAL") {
    // If they have a valid expiry date and it's in the future, they get PRO features for the trial period.
    if (tenant.subscriptionExpiry && tenant.subscriptionExpiry > now) {
      return { plan: "PRO", isTrial: true, isExpired: false };
    }
    // Trial expired -> downgraded to FREE
    return { plan: "FREE", isTrial: true, isExpired: true };
  }

  if (tenant.subscriptionTier === "FREE") {
    return { plan: "FREE", isTrial: false, isExpired: false };
  }

  // Active paid subscriptions (QUARTERLY, YEARLY, ACTIVE, etc)
  if (tenant.subscriptionTier !== "FREE" && tenant.subscriptionTier !== "TRIAL") {
    if (tenant.subscriptionExpiry && tenant.subscriptionExpiry < now) {
      return { plan: "FREE", isTrial: false, isExpired: true };
    }
    return { plan: "PRO", isTrial: false, isExpired: false };
  }

  return { plan: "FREE", isTrial: false, isExpired: false };
}
