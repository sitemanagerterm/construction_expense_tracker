import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/app/actions/expenses";
import { prisma } from "@/lib/prisma";
import ExpenseList from "@/components/expenses/ExpenseList";

export const metadata = {
  title: "Expense Tracking - MySiteBook",
};

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch expenses
  const { expenses } = await getExpenses();

  // Fetch active projects for the dropdown
  const activeProjects = await prisma.project.findMany({
    where: {
      tenantId: session.user.tenantId as string,
      status: "ACTIVE",
      isDeleted: false
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <ExpenseList 
        initialExpenses={expenses || []} 
        activeProjects={activeProjects} 
        currentUser={session.user}
      />
    </div>
  );
}
