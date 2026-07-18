import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FaBuilding, FaMoneyBillWave, FaUsers, FaArrowRight, FaTools, FaPlus } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const tenantId = session?.user?.tenantId;

  if (!tenantId) {
    return <div>Error: No Tenant ID found.</div>;
  }

  // Fetch Summary Data concurrently
  const [
    totalProjects,
    activeProjects,
    totalExpensesResult,
    totalStaff,
    recentProjects,
    recentExpenses,
    tenant
  ] = await Promise.all([
    prisma.project.count({ where: { tenantId, isDeleted: false } }),
    prisma.project.count({ where: { tenantId, isDeleted: false, status: "ACTIVE" } }),
    prisma.expense.aggregate({ 
      where: { project: { tenantId, isDeleted: false } },
      _sum: { amount: true }
    }),
    prisma.user.count({ where: { tenantId, role: "STAFF" } }),
    prisma.project.findMany({
      where: { tenantId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 4
    }),
    prisma.expense.findMany({
      where: { project: { tenantId, isDeleted: false } },
      orderBy: { date: 'desc' },
      include: { project: true }
    }),
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { currency: true } })
  ]);

  const totalExpenses = totalExpensesResult._sum.amount || 0;
  const currency = tenant?.currency || "INR";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Here is a summary of your construction business.</p>
        </div>
        <Link href="/dashboard/projects" className="hidden sm:flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 hover:bg-primary-800 transition-all hover:-translate-y-0.5">
          <FaPlus className="text-xs" /> New Project
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/projects" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center text-xl shrink-0 group-hover:bg-primary-100 transition-colors">
            <FaBuilding />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500 mb-0.5 group-hover:text-primary-900 transition-colors">Total Projects</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">{totalProjects}</h3>
          </div>
        </Link>
        <Link href="/dashboard/projects" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xl shrink-0 group-hover:bg-accent/30 transition-colors">
            <FaTools />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500 mb-0.5 group-hover:text-accent transition-colors">Active Projects</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">{activeProjects}</h3>
          </div>
        </Link>
        <Link href="/dashboard/expenses" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-100 transition-colors">
            <FaMoneyBillWave />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500 mb-0.5 group-hover:text-emerald-700 transition-colors">Total Expenses</p>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight" title={formatCurrency(totalExpenses, currency)}>{formatCurrency(totalExpenses, currency)}</h3>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-sm font-semibold text-primary-900 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="p-5 flex-1">
            {recentProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                  <FaBuilding className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No projects yet</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Create your first project to start tracking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <FaBuilding className="text-sm" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{p.clientName || 'Internal Project'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shrink-0 ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Recent Expenses</h3>
            <Link href="/dashboard/expenses" className="text-sm font-semibold text-primary-900 hover:text-primary-700 flex items-center gap-1 transition-colors">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="p-5 flex-1">
            {recentExpenses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                  <FaMoneyBillWave className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-900">No expenses yet</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Log expenses to track your site budgets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map(e => (
                  <div key={e.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <span className="font-bold text-sm">₹</span>
                      </div>
                      <div className="overflow-hidden pr-2">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{e.category}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{e.project.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-gray-900 text-sm">{formatCurrency(e.amount, currency)}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
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

