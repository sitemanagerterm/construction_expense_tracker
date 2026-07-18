import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AuditLogsClient from "./AuditLogsClient";

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || (session.user.role !== "OWNER" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  // Fetch all audit logs for expenses belonging to projects in this tenant
  const logs = await prisma.expenseAuditLog.findMany({
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
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Fetch users to map modifiedBy to names
  const userIds = [...new Set(logs.map(log => log.modifiedBy))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, role: true }
  });

  const logsWithUsers = logs.map(log => ({
    ...log,
    modifierName: users.find(u => u.id === log.modifiedBy)?.name || 'Unknown User'
  }));

  const allProjects = await prisma.project.findMany({
    where: {
      tenantId: session.user.tenantId as string,
      isDeleted: false
    },
    select: { id: true, name: true, status: true }
  });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <AuditLogsClient initialLogs={logsWithUsers} allProjects={allProjects} />
    </div>
  );
}
