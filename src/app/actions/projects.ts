"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type for creating a new project
export type ProjectFormData = {
  name: string;
  description?: string;
  clientName?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
};

// Ensure user is authenticated and get their tenantId
async function getAuthTenant() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("Unauthorized or missing Tenant ID");
  }
  return session.user.tenantId;
}

export async function getProjects() {
  try {
    const tenantId = await getAuthTenant();
    const projects = await prisma.project.findMany({
      where: {
        tenantId,
        isDeleted: false,
      },
      include: {
        expenses: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Calculate totalSpent for each project
    const projectsWithSpent = projects.map(project => {
      const activeExpenses = project.expenses.filter((exp: any) => !exp.isDeleted);
      const totalSpent = activeExpenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
      const { expenses, ...projectWithoutExpenses } = project;
      return { ...projectWithoutExpenses, totalSpent };
    });

    return { success: true, data: projectsWithSpent };
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return { success: false, error: error.message };
  }
}

export async function createProject(data: ProjectFormData) {
  try {
    const tenantId = await getAuthTenant();
    
    const newProject = await prisma.project.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        budget: data.budget,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "ACTIVE",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, data: newProject };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message || "Failed to create project" };
  }
}

export async function updateProject(projectId: string, data: ProjectFormData) {
  try {
    const tenantId = await getAuthTenant();

    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) throw new Error("Project not found");

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        budget: data.budget,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    return { success: true, data: updatedProject };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return { success: false, error: error.message || "Failed to update project" };
  }
}

export async function updateProjectStatus(projectId: string, status: string) {
  try {
    const tenantId = await getAuthTenant();

    // Ensure the project belongs to the tenant
    const project = await prisma.project.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) throw new Error("Project not found");

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const tenantId = await getAuthTenant();

    const project = await prisma.project.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) throw new Error("Project not found");

    // Soft delete
    await prisma.project.update({
      where: { id: projectId },
      data: { isDeleted: true },
    });

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message };
  }
}
