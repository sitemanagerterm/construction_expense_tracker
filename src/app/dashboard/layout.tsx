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

          {/* Global WhatsApp Floating Button */}
          <a
            href="https://wa.me/919025068407"
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:scale-105 transition-all z-[60] flex items-center justify-center group"
            aria-label="Contact Support"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span className="absolute right-full mr-3 bg-gray-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Help & Support
            </span>
          </a>

          {/* Mobile Bottom Navigation */}
          <MobileNav user={userWithRole} />
        </div>
        </div>
      </SiteProvider>
    </TenantPreferencesProvider>
  );
}
