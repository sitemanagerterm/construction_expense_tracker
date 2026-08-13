"use client";

import React, { useState } from "react";
import { updateTenantStaffLimit, renewTenantSubscription } from "@/app/actions/admin";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaEdit, FaTimes, FaSave, FaSync, FaHistory, FaEnvelope, FaInfoCircle } from "react-icons/fa";

export default function TenantsClient({ initialTenants, subscriptionPlans }: { initialTenants: any[], subscriptionPlans: any[] }) {
  const [tenants, setTenants] = useState(initialTenants);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Renewal state
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("OFFLINE");

  const startEdit = (tenant: any) => {
    setEditingId(tenant.id);
    setEditLimit(tenant.staffLimit);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (tenantId: string) => {
    setIsSaving(true);
    const toastId = toast.loading("Updating limit...");
    
    const result = await updateTenantStaffLimit(tenantId, editLimit);
    
    if (result.success) {
      toast.success("Staff limit updated!", { id: toastId });
      setTenants(tenants.map(t => t.id === tenantId ? { ...t, staffLimit: editLimit } : t));
      setEditingId(null);
    } else {
      toast.error(result.error || "Update failed", { id: toastId });
    }
    
    setIsSaving(false);
  };

  const startRenew = (tenant: any) => {
    setRenewingId(tenant.id);
    setSelectedPlan(subscriptionPlans[0]?.id || "");
    setAmountPaid(subscriptionPlans[0]?.price || 0);
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planId = e.target.value;
    setSelectedPlan(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) setAmountPaid(plan.price);
  };

  const submitRenew = async (tenantId: string) => {
    setIsSaving(true);
    const toastId = toast.loading("Processing renewal...");

    const result = await renewTenantSubscription(tenantId, selectedPlan, amountPaid, paymentMethod);

    if (result.success) {
      toast.success("Renewal successful!", { id: toastId });
      // In a real app, we'd refetch tenants here, or we can just reload the page for simplicity
      window.location.reload();
    } else {
      toast.error(result.error || "Renewal failed", { id: toastId });
      setIsSaving(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [historyTenantId, setHistoryTenantId] = useState<string | null>(null);
  const [infoTenantId, setInfoTenantId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
                          
    let matchesStatus = true;
    const now = new Date();
    const isExpired = !t.subscriptionExpiry || new Date(t.subscriptionExpiry) < now;
    
    if (filterStatus === "ACTIVE") matchesStatus = !isExpired;
    if (filterStatus === "EXPIRED") matchesStatus = isExpired;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-xs">
          <input 
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Subscription</option>
            <option value="EXPIRED">Expired Subscription</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Staff Limit</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="group relative flex items-center w-max">
                      <p className="font-bold text-gray-900 truncate max-w-[200px] cursor-default">{tenant.name}</p>
                      {tenant.name.length > 25 && (
                        <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 opacity-0 transition-opacity group-hover:opacity-100 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-xl whitespace-nowrap">
                          {tenant.name}
                          <div className="absolute left-4 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded tracking-wide">{tenant.currency}</span>
                  </div>
                  <div className="group relative flex items-center w-max">
                    <p className="text-xs text-slate-500 truncate max-w-[220px] cursor-default flex items-center gap-1.5">
                      <FaEnvelope className="w-3 h-3 opacity-50" />
                      {tenant.ownerEmail}
                    </p>
                    {tenant.ownerEmail.length > 25 && (
                      <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-1 opacity-0 transition-opacity group-hover:opacity-100 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-xl whitespace-nowrap">
                        {tenant.ownerEmail}
                        <div className="absolute left-4 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 align-middle text-sm text-gray-600 whitespace-nowrap">
                {format(new Date(tenant.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
                      tenant.subscriptionTier === 'TRIAL' ? 'bg-blue-100 text-blue-700' : 
                      (tenant.subscriptionExpiry && new Date(tenant.subscriptionExpiry) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')
                    }`}>
                      {tenant.subscriptionExpiry && new Date(tenant.subscriptionExpiry) < new Date() 
                        ? 'EXPIRED' 
                        : tenant.subscriptionTier}
                    </span>
                    {tenant.subscriptionExpiry && new Date(tenant.subscriptionExpiry) < new Date() && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 whitespace-nowrap">
                        {tenant.subscriptionTier}
                      </span>
                    )}
                  </div>
                  {tenant.subscriptionExpiry && (
                    <div className="text-[11px] font-medium text-slate-500">
                      <span>Exp: {format(new Date(tenant.subscriptionExpiry), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 align-middle whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-none">
                      {tenant.activeStaff} <span className="text-slate-400 font-medium">/ {tenant.staffLimit}</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Staff</span>
                  </div>
                  <div className="flex items-center bg-slate-100 rounded-md p-1 gap-1">
                    <button 
                      onClick={async () => {
                        if (tenant.staffLimit <= 1) return;
                        setIsSaving(true);
                        const tid = toast.loading("Updating limit...");
                        const res = await updateTenantStaffLimit(tenant.id, tenant.staffLimit - 1);
                        if (res.success) {
                          toast.success("Limit decreased!", { id: tid });
                          setTenants(tenants.map(t => t.id === tenant.id ? { ...t, staffLimit: tenant.staffLimit - 1 } : t));
                        } else {
                          toast.error(res.error || "Failed", { id: tid });
                        }
                        setIsSaving(false);
                      }}
                      disabled={tenant.staffLimit <= 1 || isSaving}
                      className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 rounded transition-all cursor-pointer shadow-sm"
                      title="Decrease Limit"
                    >
                      <span className="text-lg leading-none select-none font-medium mb-0.5">-</span>
                    </button>
                    <button 
                      onClick={async () => {
                        setIsSaving(true);
                        const tid = toast.loading("Updating limit...");
                        const res = await updateTenantStaffLimit(tenant.id, tenant.staffLimit + 1);
                        if (res.success) {
                          toast.success("Limit increased!", { id: tid });
                          setTenants(tenants.map(t => t.id === tenant.id ? { ...t, staffLimit: tenant.staffLimit + 1 } : t));
                        } else {
                          toast.error(res.error || "Failed", { id: tid });
                        }
                        setIsSaving(false);
                      }}
                      disabled={isSaving}
                      className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-50 rounded transition-all cursor-pointer shadow-sm"
                      title="Increase Limit"
                    >
                      <span className="text-lg leading-none select-none font-medium mb-0.5">+</span>
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 align-middle text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setInfoTenantId(tenant.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FaInfoCircle className="w-3 h-3" />
                    Info
                  </button>
                  <button 
                    onClick={() => setHistoryTenantId(tenant.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FaHistory className="w-3 h-3" />
                    History
                  </button>
                  <button 
                    onClick={() => startRenew(tenant)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-accent/20 hover:bg-accent hover:text-slate-900 rounded-lg transition-colors"
                  >
                    <FaSync className="w-3 h-3" />
                    Renew
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tenants.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No businesses registered yet.
        </div>
      )}

      {/* Renewal Modal */}
      {renewingId && (() => {
        const currentTenant = tenants.find(t => t.id === renewingId);
        const selectedPlanDetails = subscriptionPlans.find(p => p.id === selectedPlan);
        
        let currentExpiryDate = new Date();
        let newExpiryDate = new Date();
        
        if (currentTenant) {
          const now = new Date();
          currentExpiryDate = currentTenant.subscriptionExpiry && new Date(currentTenant.subscriptionExpiry) > now 
            ? new Date(currentTenant.subscriptionExpiry) 
            : now;
            
          if (selectedPlanDetails) {
            newExpiryDate = new Date(currentExpiryDate);
            newExpiryDate.setMonth(newExpiryDate.getMonth() + selectedPlanDetails.durationMonths);
          }
        }

        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Process Renewal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Plan</label>
                  <select 
                    value={selectedPlan}
                    onChange={handlePlanChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none"
                  >
                    {subscriptionPlans.length === 0 && <option value="" disabled>No plans available</option>}
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name} - {plan.durationMonths} Months ({plan.currency} {plan.price})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Amount Paid</label>
                  <input 
                    type="number" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 outline-none"
                  >
                    <option value="OFFLINE">Offline (Cash/Bank Transfer)</option>
                    <option value="ONLINE">Online (Gateway recorded)</option>
                    <option value="FREE_GRANT">Free Grant / Trial Extension</option>
                  </select>
                </div>

                {selectedPlanDetails && (
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Current Expiry:</span>
                      <span className="font-bold text-slate-900">{format(currentExpiryDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Plan Duration:</span>
                      <span className="font-bold text-blue-700">+{selectedPlanDetails.durationMonths} Months</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-blue-100/50 flex justify-between text-sm">
                      <span className="text-slate-700 font-bold">New Expiry Date:</span>
                      <span className="font-bold text-green-600">{format(newExpiryDate, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setRenewingId(null)}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => submitRenew(renewingId)}
                    disabled={isSaving || !selectedPlan}
                    className="px-4 py-2 text-sm font-bold text-slate-900 bg-accent hover:bg-accent-400 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSaving ? "Processing..." : "Process Renewal"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* History Modal */}
      {historyTenantId && (() => {
        const tenant = tenants.find(t => t.id === historyTenantId);
        if (!tenant) return null;
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl border border-slate-100 max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
                  <p className="text-sm text-slate-500 mt-1">Viewing records for <span className="font-bold text-slate-800">{tenant.name}</span></p>
                </div>
                <button 
                  onClick={() => setHistoryTenantId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2">
                {tenant.payments && tenant.payments.length > 0 ? (
                  <div className="space-y-3">
                    {tenant.payments.map((payment: any) => (
                      <div key={payment.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {format(new Date(payment.paymentDate), 'MMM d, yyyy - h:mm a')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700">
                              {payment.method}
                            </span>
                            {payment.planType && (
                              <span className="text-xs text-slate-500 font-medium">Plan: {payment.planType}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            +{payment.currency === 'INR' ? '₹' : payment.currency}{payment.amount}
                          </p>
                          {payment.transactionReference && (
                            <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {payment.transactionReference}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-slate-500 font-medium">No payment history found for this tenant.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {/* Info Modal */}
      {infoTenantId && (() => {
        const tenant = tenants.find(t => t.id === infoTenantId);
        if (!tenant) return null;
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-xl border border-slate-100 max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Business Details</h2>
                  <p className="text-sm text-slate-500 mt-1">Information provided during registration for <span className="font-bold text-slate-800">{tenant.name}</span></p>
                </div>
                <button 
                  onClick={() => setInfoTenantId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Business Name</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.name}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Owner Email</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.ownerEmail}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Business Type</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.businessType}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Contact Person</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.contactPerson}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Mobile No</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.mobileNo}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Language</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.language}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 sm:col-span-2">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.address}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pincode</p>
                    <p className="text-sm font-semibold text-slate-900">{tenant.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
    </div>
  );
}
