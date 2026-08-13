"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePlatformSettings, changeSuperAdminPassword } from "@/app/actions/admin";
import toast from "react-hot-toast";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [supportPhone, setSupportPhone] = useState(initialSettings.supportPhone || "");
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail || "");
  const [offlinePaymentInstructions, setOfflinePaymentInstructions] = useState(initialSettings.offlinePaymentInstructions || "");
  
  // Payment Gateway State
  const [activeGateway, setActiveGateway] = useState(initialSettings.activeGateway || "OFFLINE");
  const [razorpayKeyId, setRazorpayKeyId] = useState(initialSettings.razorpayKeyId || "");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(initialSettings.razorpayKeySecret || "");
  const [stripePublicKey, setStripePublicKey] = useState(initialSettings.stripePublicKey || "");
  const [stripeSecretKey, setStripeSecretKey] = useState(initialSettings.stripeSecretKey || "");

  const [isSaving, setIsSaving] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setIsChangingPassword(true);
    const toastId = toast.loading("Updating password...");

    const result = await changeSuperAdminPassword(currentPassword, newPassword);

    if (result.success) {
      toast.success("Password changed successfully!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Failed to change password", { id: toastId });
    }
    
    setIsChangingPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving settings...");

    const result = await updatePlatformSettings({
      supportPhone,
      supportEmail,
      offlinePaymentInstructions,
      activeGateway,
      razorpayKeyId,
      razorpayKeySecret,
      stripePublicKey,
      stripeSecretKey
    });

    if (result.success) {
      toast.success("Settings saved successfully!", { id: toastId });
    } else {
      toast.error(result.error || "Failed to save settings", { id: toastId });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Support Contact Details</h3>
            <p className="text-sm text-slate-500 mt-1">This information will be displayed to Tenants when their subscription expires.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Support Phone Number</label>
              <input 
                type="text" 
                value={supportPhone} 
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 transition-all outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Support Email Address</label>
              <input 
                type="email" 
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@mysitebook.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 transition-all outline-none text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Payment Gateway Configuration</h3>
            <p className="text-sm text-slate-500 mt-1">Configure how tenants can pay for their subscription renewals online or offline.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Active Payment Method</label>
              <select 
                value={activeGateway}
                onChange={(e) => setActiveGateway(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 font-medium transition-all outline-none text-slate-900"
              >
                <option value="OFFLINE">Offline Payments Only (Manual Verification)</option>
                <option value="RAZORPAY">Razorpay (India / Global)</option>
                <option value="STRIPE">Stripe (Global)</option>
              </select>
            </div>

            {activeGateway === "OFFLINE" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-amber-50/50 p-5 rounded-xl border border-amber-100">
                <label className="block text-sm font-semibold text-amber-900 mb-1.5">Offline Payment Instructions</label>
                <p className="text-xs text-amber-700/80 mb-3">Provide bank transfer details, UPI IDs, or address for offline payments.</p>
                <textarea 
                  value={offlinePaymentInstructions} 
                  onChange={(e) => setOfflinePaymentInstructions(e.target.value)}
                  rows={4}
                  placeholder="Please transfer the subscription amount to Account No: XXXXXXXX, IFSC: XXXXXXX"
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all outline-none resize-none text-slate-900"
                />
              </div>
            )}

            {activeGateway === "RAZORPAY" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razorpay Key ID</label>
                  <input 
                    type="text" 
                    value={razorpayKeyId} 
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    placeholder="rzp_test_..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Razorpay Key Secret</label>
                  <input 
                    type="password" 
                    value={razorpayKeySecret} 
                    onChange={(e) => setRazorpayKeySecret(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all outline-none text-slate-900"
                  />
                </div>
              </div>
            )}

            {activeGateway === "STRIPE" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stripe Publishable Key</label>
                  <input 
                    type="text" 
                    value={stripePublicKey} 
                    onChange={(e) => setStripePublicKey(e.target.value)}
                    placeholder="pk_test_..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stripe Secret Key</label>
                  <input 
                    type="password" 
                    value={stripeSecretKey} 
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white transition-all outline-none text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 text-sm font-bold text-slate-900 bg-accent hover:bg-accent-400 rounded-xl transition-all disabled:opacity-50 shadow-sm hover:shadow active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {isSaving ? "Saving Settings..." : "Save Settings"}
          </button>
        </div>
      </form>

        {/* Security / Password Section */}
        <div id="security" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="bg-slate-50 border-b border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Admin Security</h3>
            <p className="text-sm text-slate-500 mt-1">Change your Super Admin password.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 transition-all outline-none text-slate-900"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 transition-all outline-none text-slate-900"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-slate-50 transition-all outline-none text-slate-900"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-start pt-6 border-t border-slate-100 mt-6 max-w-2xl">
              <button 
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-2.5 text-sm font-bold text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl transition-all disabled:opacity-50 shadow-sm outline-none"
              >
                {isChangingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>

    </div>
  );
}
