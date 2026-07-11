import React from "react";
import TenantsClient from "./TenantsClient";
import { getTenants, getSubscriptionPlans } from "@/app/actions/admin";

export default async function TenantsPage() {
  const { tenants = [] } = await getTenants();
  const { plans = [] } = await getSubscriptionPlans();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenant Management</h1>
          <p className="text-slate-500 mt-1">Manage staff limits and subscription renewals for all businesses.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <TenantsClient initialTenants={tenants} subscriptionPlans={plans} />
      </div>
    </div>
  );
}
