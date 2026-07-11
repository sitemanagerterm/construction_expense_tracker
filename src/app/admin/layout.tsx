import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SuperAdminSidebar from "@/components/admin/SuperAdminSidebar";
import TopHeader from "@/components/dashboard/TopHeader";
import SuperAdminMobileNav from "@/components/admin/SuperAdminMobileNav";
import { TenantPreferencesProvider } from "@/components/providers/TenantProvider";

export const metadata = {
  title: "Super Admin Panel - MySiteBook",
  description: "Manage platform tenants and settings",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <TenantPreferencesProvider language="en" currency="INR">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <SuperAdminSidebar user={session.user} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopHeader user={session.user} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
          <SuperAdminMobileNav user={session.user} />
        </div>
      </div>
    </TenantPreferencesProvider>
  );
}
