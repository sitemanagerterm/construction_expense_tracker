import React from "react";
import { getDashboardMetrics } from "@/app/actions/admin";
import { Building2, AlertTriangle, CreditCard, Users, BadgeCheck, Wallet } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const { metrics } = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Super Admin Overview</h1>
          <p className="text-slate-500 mt-1">High-level metrics for the platform.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Tenants */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-blue-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Tenants</p>
            <h2 className="text-4xl font-bold text-slate-900">{metrics?.totalTenants || 0}</h2>
            <Link href="/admin/tenants" className="text-blue-500 text-sm font-medium mt-4 inline-block hover:underline">View All &rarr;</Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Tenants */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-emerald-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Tenants</p>
            <h2 className="text-4xl font-bold text-slate-900">{metrics?.activeTenants || 0}</h2>
            <span className="text-slate-400 text-sm font-medium mt-4 inline-block">Currently Subscribed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <BadgeCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-amber-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Expiring Soon (14 days)</p>
            <h2 className="text-4xl font-bold text-amber-600">{metrics?.expiringSoon || 0}</h2>
            <Link href="/admin/tenants" className="text-amber-600 text-sm font-medium mt-4 inline-block hover:underline">Manage Renewals &rarr;</Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-indigo-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
            <h2 className="text-4xl font-bold text-slate-900">{metrics?.totalUsers || 0}</h2>
            <span className="text-slate-400 text-sm font-medium mt-4 inline-block">Across all tenants</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Plans */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-purple-200 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Plans</p>
            <h2 className="text-4xl font-bold text-slate-900">{metrics?.activePlans || 0}</h2>
            <Link href="/admin/plans" className="text-purple-600 text-sm font-medium mt-4 inline-block hover:underline">Manage Plans &rarr;</Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start justify-between group hover:border-accent transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
            <h2 className="text-4xl font-bold text-slate-900">₹{metrics?.totalRevenue?.toLocaleString() || 0}</h2>
            <span className="text-slate-400 text-sm font-medium mt-4 inline-block">Lifetime Earnings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>
    </div>
  );
}
