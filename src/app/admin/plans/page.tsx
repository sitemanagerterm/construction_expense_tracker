import React from "react";
import PlansClient from "./PlansClient";
import { getSubscriptionPlans } from "@/app/actions/admin";

export default async function PlansPage() {
  const { plans = [] } = await getSubscriptionPlans();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-slate-500 mt-1">Manage the available pricing tiers and duration for tenants.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <PlansClient initialPlans={plans} />
      </div>
    </div>
  );
}
