import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import TopHeader from "@/components/dashboard/TopHeader";
import DesktopHeader from "@/components/dashboard/DesktopHeader";
import { prisma } from "@/lib/prisma";
import { TenantPreferencesProvider } from "@/components/providers/TenantProvider";
import { SiteProvider } from "@/components/providers/SiteProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Require Onboarding if they don't have a tenant ID (except for STAFF who might not have completed it but should have a tenant)
  if (!session.user.tenantId) {
    redirect("/onboarding");
  }

  // Fetch tenant preferences and expiry
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { language: true, currency: true, subscriptionExpiry: true, name: true }
  });

  if (tenant?.subscriptionExpiry && new Date(tenant.subscriptionExpiry) < new Date()) {
    redirect("/expired");
  }

  let userWithRole = { ...session.user } as any;
  if (session.user.role === "STAFF") {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenantRole: true }
    });
    if (dbUser?.tenantRole) {
      userWithRole.tenantRole = dbUser.tenantRole;
    }
  }

  // Fetch active projects for global site selector
  const activeProjects = await prisma.project.findMany({
    where: {
      tenantId: session.user.tenantId,
      status: "ACTIVE",
      isDeleted: false,
      ...(session.user.role === "STAFF" ? { allocatedUsers: { some: { id: session.user.id } } } : {})
    },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <TenantPreferencesProvider language={tenant?.language || "en"} currency={tenant?.currency || "INR"}>
      <SiteProvider initialProjects={activeProjects}>
        <div className="flex h-screen bg-slate-50 dark:bg-brandbg overflow-hidden text-gray-900 dark:text-slate-200 font-sans transition-colors duration-200">
        {/* Desktop Sidebar */}
        <Sidebar user={userWithRole} tenantName={tenant?.name || "Company"} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Desktop Global Header */}
          <DesktopHeader />

          {/* Mobile Top Header */}
          <TopHeader user={userWithRole} tenantName={tenant?.name || "Company"} />

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav user={userWithRole} />
        </div>
        </div>
      </SiteProvider>
    </TenantPreferencesProvider>
  );
}
