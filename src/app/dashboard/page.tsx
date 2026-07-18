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

  // Find the most recently updated active project
  const latestProject = await prisma.project.findFirst({
    where: { 
      tenantId, 
      isDeleted: false,
      status: "ACTIVE" 
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  if (latestProject) {
    redirect(`/dashboard/projects/${latestProject.id}`);
  } else {
    // If no active project, maybe check if there is any completed project
    const anyProject = await prisma.project.findFirst({
      where: { tenantId, isDeleted: false },
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
