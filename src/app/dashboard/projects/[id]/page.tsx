import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      tenantId: session.user.tenantId as string,
      isDeleted: false
    },
    include: {
      expenses: {
        orderBy: { date: 'desc' },
        include: { user: true }
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

  const tenant = await prisma.tenant.findUnique({ where: { id: session.user.tenantId as string }, select: { currency: true } });
  const currency = tenant?.currency || "INR";

  const totalExpenses = project.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/projects" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-500 text-sm">{project.clientName || "Internal Project"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Site Details</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Status</p>
                <span className="inline-flex px-2 py-1 bg-green-50 text-green-700 font-bold rounded text-xs tracking-wider uppercase">
                  {project.status}
                </span>
              </div>
              
              <div>
                <p className="text-gray-500 mb-1">Total Budget</p>
                <p className="font-bold text-gray-900 text-lg">
                  {project.budget ? formatCurrency(project.budget, currency) : 'Not set'}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Total Spent</p>
                <p className="font-bold text-red-600 text-lg">
                  {formatCurrency(totalExpenses, currency)}
                </p>
                {project.budget && (
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${totalExpenses > project.budget ? 'bg-red-500' : 'bg-accent'}`} 
                        style={{ width: `${Math.min((totalExpenses / project.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-brandtext-secondary">Budget Usage</span>
                      <span className="text-xs font-bold text-brandtext-secondary">{Math.round((totalExpenses / project.budget) * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-900">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Not set'}
                </p>
              </div>

              {project.endDate && (
                <div>
                  <p className="text-gray-500 mb-1">Completed Date</p>
                  <p className="font-medium text-emerald-700">
                    {new Date(project.endDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Recent Expenses</h3>
              <Link href="/dashboard/expenses" className="text-sm font-semibold text-primary-600 hover:text-primary-800">
                View All
              </Link>
            </div>
            
            {project.expenses.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No expenses logged for this project yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {project.expenses.slice(0, 10).map(expense => (
                  <div key={expense.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{expense.category}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(expense.date).toLocaleDateString('en-IN')}</p>
                      {expense.notes && <p className="text-sm text-gray-600 mt-1">{expense.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₹{expense.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mt-1">By {expense.user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
