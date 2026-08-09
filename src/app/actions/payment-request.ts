"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getPaymentRequestData(projectId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        tenantId: session.user.tenantId as string,
        isDeleted: false
      },
      include: {
        credits: {
          where: { isDeleted: false },
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Calculate total received and balance
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
          startDate: project.startDate,
          endDate: project.endDate,
          status: project.status,
          location: project.description || "N/A"
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
        }))
      }
    };
  } catch (error: any) {
    console.error("Error fetching payment request data:", error);
    return { success: false, error: error.message };
  }
}
