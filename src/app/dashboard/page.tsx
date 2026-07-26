import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  const tenantId = session.user.tenantId;

  // Determine base query conditions
  const projectWhereClause: any = {
    tenantId,
    isDeleted: false,
    status: "ACTIVE"
  };

  if (session.user.role === "STAFF") {
    projectWhereClause.allocatedUsers = {
      some: { id: session.user.id }
    };
  }

  // Find the most recently updated active project
  const latestProject = await prisma.project.findFirst({
    where: projectWhereClause,
    orderBy: {
      updatedAt: 'desc'
    }
  });

  if (latestProject) {
    redirect(`/dashboard/projects/${latestProject.id}`);
  } else {
    // If no active project, maybe check if there is any completed project
    const anyProjectWhere = { tenantId, isDeleted: false };
    if (session.user.role === "STAFF") {
      (anyProjectWhere as any).allocatedUsers = { some: { id: session.user.id } };
    }

    const anyProject = await prisma.project.findFirst({
      where: anyProjectWhere,
      orderBy: { updatedAt: 'desc' }
    });
    
    if (anyProject) {
       redirect(`/dashboard/projects/${anyProject.id}`);
    } else {
       // If no projects exist at all, send them to create one
       redirect("/dashboard/projects/new");
    }
  }
}
