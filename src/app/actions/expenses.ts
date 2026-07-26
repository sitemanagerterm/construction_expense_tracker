"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type for the incoming expense data
export type CreateExpenseInput = {
  projectId: string;
  amount: number;
  category: string;
  date: string | Date;
  notes?: string;
  receiptUrl?: string;
  offlineId?: string; // Used by the client to track pending offline syncs
};

export async function createExpense(data: CreateExpenseInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const { projectId, amount, category, date, notes, receiptUrl, offlineId } = data;

    // Verify the project belongs to the user's tenant
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { tenantId: true, status: true }
    });

    if (!project || project.tenantId !== session.user.tenantId) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    if (project.status === 'COMPLETED') {
      return { success: false, error: "Cannot create an expense for a completed project." };
    }

    const expense = await prisma.expense.create({
      data: {
        projectId,
        userId: session.user.id,
        amount,
        category,
        date: new Date(date),
        notes,
        receiptUrl
      },
      include: {
        project: { select: { name: true } },
        user: { select: { name: true, role: true } }
      }
    });

    revalidatePath("/dashboard/expenses");
    revalidatePath("/dashboard/projects");
    
    return { success: true, expense, offlineId };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, error: "Failed to create expense" };
  }
}

export async function getExpenses() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return { success: false, error: "Unauthorized" };
    }

    const expenses = await prisma.expense.findMany({
      where: {
        project: {
          tenantId: session.user.tenantId,
          ...(session.user.role === "STAFF" ? { allocatedUsers: { some: { id: session.user.id } } } : {})
        },
        isDeleted: false
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        user: {
          select: { id: true, name: true, role: true }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return { success: true, expenses };
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return { success: false, error: "Failed to fetch expenses" };
  }
}

export async function deleteExpense(id: string, reason: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    if (!reason || reason.trim() === "") {
      return { success: false, error: "Deletion reason is required" };
    }

    const existing = await prisma.expense.findUnique({ 
      where: { id },
      include: { project: true } 
    });
    if (!existing) return { success: false, error: "Not found" };

    if (existing.project?.status === 'COMPLETED') {
      return { success: false, error: "Cannot delete an expense from a completed project." };
    }

    // Only OWNER or SUPER_ADMIN can delete expenses (or staff if on the same day AND they created it)
    if (session.user.role !== "OWNER" && session.user.role !== "SUPER_ADMIN") {
      
      if (existing.userId !== session.user.id) {
        return { success: false, error: "Staff can only archive their own entries." };
      }

      const today = new Date();
      const expenseDate = new Date(existing.createdAt);
      if (
        today.getFullYear() !== expenseDate.getFullYear() ||
        today.getMonth() !== expenseDate.getMonth() ||
        today.getDate() !== expenseDate.getDate()
      ) {
        return { success: false, error: "Staff cannot archive expenses from previous days." };
      }
    }
    
    await prisma.$transaction([
      prisma.expense.update({
        where: { id },
        data: { isDeleted: true }
      }),
      prisma.expenseAuditLog.create({
        data: {
          expenseId: id,
          action: "DELETED",
          reason: reason,
          modifiedBy: session.user.id
        }
      })
    ]);

    revalidatePath("/dashboard/expenses");
    if (existing?.projectId) {
      revalidatePath(`/dashboard/projects/${existing.projectId}`);
    }
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return { success: false, error: "Failed to delete expense" };
  }
}

export async function updateExpense(id: string, data: Partial<CreateExpenseInput>, reason?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    
    const existing = await prisma.expense.findUnique({ where: { id }, include: { project: true } });
    if (!existing || existing.project.tenantId !== session.user.tenantId) {
      return { success: false, error: "Not found or unauthorized" };
    }

    if (existing.project.status === 'COMPLETED') {
      return { success: false, error: "Cannot edit an expense in a completed project." };
    }

    if (session.user.role !== "OWNER" && session.user.role !== "SUPER_ADMIN") {
      if (existing.userId !== session.user.id) {
        return { success: false, error: "Staff can only edit their own entries." };
      }
      const today = new Date();
      const expenseDate = new Date(existing.createdAt);
      if (
        today.getFullYear() !== expenseDate.getFullYear() ||
        today.getMonth() !== expenseDate.getMonth() ||
        today.getDate() !== expenseDate.getDate()
      ) {
        return { success: false, error: "Staff cannot edit expenses from previous days." };
      }
    }

    const { projectId, amount, category, date, notes, receiptUrl } = data;
    
    if (!reason || reason.trim() === "") {
      return { success: false, error: "Reason for edit is required" };
    }

    const isAmountChanged = amount !== undefined && amount !== existing.amount;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(projectId && { projectId }),
        ...(amount !== undefined && { amount }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
        ...(receiptUrl !== undefined && { receiptUrl }),
      },
      include: {
        project: { select: { name: true } },
        user: { select: { id: true, name: true, role: true } }
      }
    });

    await prisma.expenseAuditLog.create({
      data: {
        expenseId: id,
        action: "EDITED",
        reason: reason,
        modifiedBy: session.user.id,
        ...(isAmountChanged && {
          oldAmount: existing.amount,
          newAmount: amount
        })
      }
    });

    revalidatePath("/dashboard/expenses");
    revalidatePath("/dashboard/projects");
    return { success: true, expense };
  } catch (error) {
    console.error("Failed to update expense:", error);
    return { success: false, error: "Failed to update expense" };
  }
}

export async function parseExpenseFromAudio(base64Data: string, mimeType: string) {
  // TODO: Implement OpenAI Whisper API
  // For now, return a mock successful response to demonstrate the UI flow!
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { 
    success: true, 
    data: {
      amount: 500,
      category: "TRANSPORT",
      notes: "Paid 500 to transport for Alpha Project"
    }
  };
}
