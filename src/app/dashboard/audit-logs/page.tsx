import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AuditLogsClient from "./AuditLogsClient";

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch full user to get tenantRole permissions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tenantRole: true }
  });

  const hasAccess = 
    session.user.role === "OWNER" || 
    session.user.role === "SUPER_ADMIN" || 
    (session.user.role === "STAFF" && user?.tenantRole?.permissions?.includes("audit_log.view"));

  if (!hasAccess) {
    redirect("/dashboard");
  }

  // Fetch all audit logs for expenses
  const expenseLogs = await prisma.expenseAuditLog.findMany({
    where: {
      expense: {
        project: {
          tenantId: session.user.tenantId as string,
        }
      }
    },
    include: {
      expense: {
        select: {
          amount: true,
          category: true,
          date: true,
          project: { select: { name: true } }
        }
      }
    },
  });

  // Fetch all audit logs for credits
  const creditLogs = await prisma.creditAuditLog.findMany({
    where: {
      credit: {
        project: {
          tenantId: session.user.tenantId as string,
        }
      }
    },
    include: {
      credit: {
        select: {
          amount: true,
          paymentMethod: true,
          date: true,
          project: { select: { name: true } }
        }
      }
    },
  });

  // Combine and sort logs by createdAt desc
  const combinedLogs = [
    ...expenseLogs.map(log => ({ ...log, type: 'EXPENSE' as const })),
    ...creditLogs.map(log => ({ ...log, type: 'CREDIT' as const }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Fetch users to map modifiedBy to names
  const userIds = [...new Set(combinedLogs.map(log => log.modifiedBy))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, role: true }
  });

  const logsWithUsers = combinedLogs.map(log => ({
    ...log,
    modifierName: users.find(u => u.id === log.modifiedBy)?.name || 'Unknown User'
  }));

  const allProjects = await prisma.project.findMany({
    where: {
      tenantId: session.user.tenantId as string,
    },
    select: { id: true, name: true, status: true }
  });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <AuditLogsClient initialLogs={logsWithUsers} allProjects={allProjects} />
    </div>
  );
}
