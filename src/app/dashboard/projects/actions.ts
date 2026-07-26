"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addCredit(data: { projectId: string; amount: number; paymentMethod: string; notes?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Ensure the project belongs to the tenant
  const project = await prisma.project.findFirst({
    where: {
      id: data.projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status === 'COMPLETED') {
    throw new Error("Cannot add credit to a completed project");
  }

  await prisma.credit.create({
    data: {
      projectId: data.projectId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    }
  });

  revalidatePath(`/dashboard/projects/${data.projectId}`);
  return { success: true };
}

export async function updateCredit(data: { creditId: string; projectId: string; amount: number; paymentMethod: string; notes?: string; reason?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: data.projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status === 'COMPLETED') {
    throw new Error("Cannot edit credit in a completed project");
  }

  const existingCredit = await prisma.credit.findUnique({
    where: { id: data.creditId }
  });

  if (!existingCredit) {
    throw new Error("Credit not found");
  }

  await prisma.$transaction([
    prisma.credit.update({
      where: { id: data.creditId },
      data: {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      }
    }),
    prisma.creditAuditLog.create({
      data: {
        creditId: data.creditId,
        action: "EDITED",
        reason: data.reason || "Credit edited",
        modifiedBy: session.user.id,
        oldAmount: existingCredit.amount,
        newAmount: data.amount,
      }
    })
  ]);

  revalidatePath(`/dashboard/projects/${data.projectId}`);
  return { success: true };
}

export async function deleteCredit(creditId: string, projectId: string, reason: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Ensure the project belongs to the tenant
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status === 'COMPLETED') {
    throw new Error("Cannot delete credit from a completed project");
  }

  const credit = await prisma.credit.findUnique({
    where: { id: creditId }
  });

  if (!credit) {
    throw new Error("Credit not found");
  }

  // Perform soft delete in a transaction to ensure audit log is created
  await prisma.$transaction([
    prisma.credit.update({
      where: { id: creditId },
      data: { isDeleted: true }
    }),
    prisma.creditAuditLog.create({
      data: {
        creditId,
        action: "DELETED",
        reason: reason || "No reason provided",
        modifiedBy: session.user.id,
        oldAmount: credit.amount,
      }
    })
  ]);

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function addExpenses(projectId: string, expenses: Array<{ category: string; amount: number; notes?: string; date?: string | Date }>) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Ensure the project belongs to the tenant
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status === 'COMPLETED') {
    throw new Error("Cannot add expenses to a completed project");
  }

  // Use createMany to insert multiple expenses
  await prisma.expense.createMany({
    data: expenses.map(exp => ({
      projectId,
      userId: session.user.id,
      category: exp.category.toUpperCase(), // basic normalization
      amount: exp.amount,
      notes: exp.notes || "",
      date: exp.date ? new Date(exp.date) : new Date(),
    }))
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function toggleProjectStatus(projectId: string, currentStatus: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  const newStatus = currentStatus === "ACTIVE" ? "COMPLETED" : "ACTIVE";

  await prisma.project.update({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    },
    data: {
      status: newStatus,
    }
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/dashboard`);
  return { success: true, status: newStatus };
}

export async function updateProjectBudget(projectId: string, budget: number) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status === 'COMPLETED') {
    throw new Error("Cannot update budget of a completed project");
  }

  await prisma.project.update({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    },
    data: {
      budget,
    }
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/dashboard`);
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  if (session.user.role === "STAFF") {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      tenantId: session.user.tenantId as string,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.status !== 'COMPLETED') {
    throw new Error("Only completed projects can be deleted. Please mark the project as completed first.");
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isDeleted: true
    }
  });

  revalidatePath(`/dashboard`);
  return { success: true };
}
