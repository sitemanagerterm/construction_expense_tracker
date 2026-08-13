"use client";

import React, { useState } from "react";
import { createSubscriptionPlan, updateSubscriptionPlan } from "@/app/actions/admin";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Edit2 } from "lucide-react";

export default function PlansClient({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleCreate = () => {
    setIsEditing(null);
    setName("");
    setDurationMonths(1);
    setPrice(0);
    setIsActive(true);
    setIsCreating(true);
  };

  const handleEdit = (plan: any) => {
    setIsEditing(plan);
    setName(plan.name);
    setDurationMonths(plan.durationMonths);
    setPrice(plan.price);
    setIsActive(plan.isActive ?? true);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading(isEditing ? "Updating plan..." : "Creating plan...");

    const payload = {
      name,
      durationMonths: parseInt(durationMonths as any) || 1,
      price: parseFloat(price as any) || 0,
      isActive
    };

    const result = isEditing 
      ? await updateSubscriptionPlan(isEditing.id, payload)
      : await createSubscriptionPlan(payload);

    if (result.success) {
      toast.success(isEditing ? "Plan updated!" : "Plan created!", { id: toastId });
      window.location.reload(); // Simple reload to get updated list
    } else {
      toast.error(result.error || (isEditing ? "Failed to update plan" : "Failed to create plan"), { id: toastId });
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="p-6 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Available Plans</h2>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-accent text-slate-900 rounded-xl text-sm font-bold hover:bg-accent-400 transition-colors shadow-sm"
        >
          + Add New Plan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{plan.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {plan.durationMonths} Months
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {plan.currency} {plan.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {format(new Date(plan.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {plans.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No plans created yet.
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{isEditing ? "Edit Subscription Plan" : "Create Subscription Plan"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Name (e.g., QUARTERLY)</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (Months)</label>
                <input 
                  type="number" 
                  value={durationMonths === 0 && durationMonths.toString() === "0" ? "" : durationMonths} 
                  onChange={(e) => setDurationMonths(e.target.value === "" ? ("" as any) : parseInt(e.target.value))}
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
                <input 
                  type="number" 
                  value={price === 0 && price.toString() === "0" ? "" : price} 
                  onChange={(e) => setPrice(e.target.value === "" ? ("" as any) : parseFloat(e.target.value))}
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Plan is Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || !name}
                  className="px-4 py-2 text-sm font-bold text-slate-900 bg-accent hover:bg-accent-400 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Plan" : "Create Plan")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
