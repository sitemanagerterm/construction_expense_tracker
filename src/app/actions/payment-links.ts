"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createPaymentRequest(payload: {
  projectId: string;
  amount: number;
  paymentFor: string;
  dueDate: string | null;
  notes: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify project belongs to tenant
    const project = await prisma.project.findFirst({
      where: {
        id: payload.projectId,
        tenantId: session.user.tenantId as string,
        isDeleted: false
      }
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        tenantId: session.user.tenantId as string,
        projectId: payload.projectId,
        amount: payload.amount,
        paymentFor: payload.paymentFor,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        notes: payload.notes
      }
    });

    return { success: true, data: { id: paymentRequest.id } };
  } catch (error: any) {
    console.error("Error creating payment request:", error);
    return { success: false, error: "Failed to save payment request" };
  }
}

export async function getSecurePaymentRequestData(requestId: string) {
  try {
    const request = await prisma.paymentRequest.findFirst({
      where: {
        id: requestId
      },
      include: {
        tenant: true,
        project: {
          include: {
            credits: {
              where: { isDeleted: false },
              orderBy: { date: 'desc' }
            }
          }
        }
      }
    });

    if (!request || request.project.isDeleted) {
      return { success: false, error: "Payment request link is invalid or expired." };
    }

    const project = request.project;
    const totalReceived = project.credits.reduce((acc: number, credit: any) => acc + credit.amount, 0);
    const balanceAmount = (project.budget || 0) - totalReceived;
    const progress = project.budget ? Math.min(100, Math.round((totalReceived / project.budget) * 100)) : 0;

    return {
      success: true,
      data: {
        requestDetails: {
          id: request.id,
          amount: request.amount,
          paymentFor: request.paymentFor,
          dueDate: request.dueDate,
          notes: request.notes,
          status: request.status
        },
        project: {
          id: project.id,
          name: project.name,
          budget: project.budget || 0,
          status: project.status,
          location: project.description || "N/A",
          clientName: project.clientName || "Client"
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
          name: request.tenant.name,
          currency: request.tenant.currency,
          bankAccountName: request.tenant.bankAccountName,
          bankAccountNumber: request.tenant.bankAccountNumber,
          bankIfscCode: request.tenant.bankIfscCode,
          bankUpiId: request.tenant.bankUpiId,
          bankGpayNumber: request.tenant.bankGpayNumber
        }
      }
    };
  } catch (error: any) {
    console.error("Error fetching secure payment request data:", error);
    return { success: false, error: "Failed to load payment request." };
  }
}
