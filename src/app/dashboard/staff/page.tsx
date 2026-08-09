import React from "react";
import { getStaff } from "@/app/actions/staff";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StaffClientPage from "./StaffClientPage";
import { getTenantPlan } from "@/lib/subscription";

export const metadata = {
  title: "Staff & Team | MySiteBook",
};

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch full user to get tenantRole permissions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tenantRole: true }
  });

  let userPermissions: string[] = [];
  if (user?.tenantRole?.permissions) {
    try {
      userPermissions = JSON.parse(user.tenantRole.permissions);
    } catch {
      userPermissions = [];
    }
  }

  const hasAccess = 
    session.user.role === "OWNER" || 
    session.user.role === "SUPER_ADMIN" || 
    (session.user.role === "STAFF" && userPermissions.includes("staff.view"));

  if (!hasAccess) {
    redirect("/dashboard");
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: session?.user?.tenantId as string } });
  const lang = tenant?.language || "en";
  const { dictionaries } = await import("@/lib/i18n/dictionaries");
  const t = (key: string) => dictionaries[lang]?.[key] || dictionaries["en"][key] || key;

  const { data: staff, staffLimit, activeStaffCount, error } = await getStaff();
  
  const roles = await prisma.tenantRole.findMany({
    where: { tenantId: session?.user?.tenantId as string },
    orderBy: { createdAt: 'asc' }
  });

  const activeProjects = await prisma.project.findMany({
    where: {
      tenantId: session?.user?.tenantId as string,
      status: "ACTIVE",
      isDeleted: false
    },
    select: { id: true, name: true }
  });

  const { plan } = await getTenantPlan(session.user.tenantId as string);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('staff')}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{t('staff_desc')}</p>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl">Error loading staff: {error}</div>
      ) : (
        <StaffClientPage 
          initialStaff={staff || []} 
          staffLimit={staffLimit || 1}
          activeStaffCount={activeStaffCount || 0}
          initialRoles={roles}
          activeProjects={activeProjects}
          userRole={session.user.role}
          userPermissions={userPermissions}
          plan={plan}
        />
      )}
    </div>
  );
}
