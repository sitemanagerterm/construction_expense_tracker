import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import ProjectDashboardClient from "./ProjectDashboardClient";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
      isDeleted: false
    },
    include: {
      expenses: {
        where: { isDeleted: false },
        orderBy: { date: 'desc' },
        include: { user: true }
      },
      credits: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!project) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
        <p className="text-gray-500 mb-6">The project you are looking for does not exist or has been deleted.</p>
        <Link href="/dashboard/projects" className="bg-primary-900 text-white px-6 py-2.5 rounded-xl font-semibold">
          Back to Projects
        </Link>
      </div>
    );
  }

  const allProjects = await prisma.project.findMany({
    where: {
      tenantId: session.user.tenantId as string,
      isDeleted: false
    },
    select: { id: true, name: true }
  });

  const tenant = await prisma.tenant.findUnique({ where: { id: session.user.tenantId as string }, select: { currency: true } });
  const currency = tenant?.currency || "INR";

  return (
    <ProjectDashboardClient 
      project={project} 
      allProjects={allProjects} 
      currency={currency} 
    />
  );
}
