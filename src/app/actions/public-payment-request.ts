"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicPaymentRequestData(projectId: string) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        isDeleted: false
      },
      include: {
        tenant: true,
        credits: {
          where: { isDeleted: false },
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!project) {
      return { success: false, error: "Project not found or is private." };
    }

    const totalReceived = project.credits.reduce((acc: number, credit: any) => acc + credit.amount, 0);
    const balanceAmount = (project.budget || 0) - totalReceived;
    const progress = project.budget ? Math.min(100, Math.round((totalReceived / project.budget) * 100)) : 0;

    return {
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          budget: project.budget,
          status: project.status,
          location: project.description || "N/A",
          clientName: "Client" // Assuming 'Client' if not defined on schema
        },
        financials: {
          totalReceived,
          balanceAmount,
          progress
        },
        recentCredits: project.credits.map((c: any) => ({
          id: c.id,
          amount: c.amount,
          date: c.date,
          method: c.paymentMethod,
          notes: c.notes
        })),
        tenant: {
          name: project.tenant.name,
          currency: project.tenant.currency
        }
      }
    };
  } catch (error: any) {
    console.error("Error fetching public payment request data:", error);
    return { success: false, error: "Failed to load public data." };
  }
}
