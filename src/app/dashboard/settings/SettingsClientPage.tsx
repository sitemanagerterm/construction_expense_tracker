"use client";

import React, { useState } from "react";
import { updateProfile, ProfileFormData, updateTenantSettings, TenantSettingsFormData } from "@/app/actions/settings";
import toast from "react-hot-toast";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  mobileNumber: string | null;
  role: string;
  tenant: { name: string; currency: string; language: string; } | null;
};

type ValidationErrors = {
  name?: string;
  mobileNumber?: string;
};

export default function SettingsClientPage({ initialUser }: { initialUser: UserData }) {
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [currency, setCurrency] = useState(initialUser.tenant?.currency || "INR");
  const [language, setLanguage] = useState(initialUser.tenant?.language || "en");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const mobileNumber = formData.get("mobileNumber") as string;

    // Custom Validation
    let currentErrors: ValidationErrors = {};
    
    if (!name || name.trim() === "") {
      currentErrors.name = "Full name is required.";
    }
    
    if (mobileNumber && mobileNumber.trim() !== "") {
      if (!/^\d{10}$/.test(mobileNumber.trim())) {
        currentErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
      }
    }

    if (Object.keys(currentErrors).length > 0) {
      setValidationErrors(currentErrors);
      setLoading(false);
      return;
    }

    const data: ProfileFormData = {
      name: name.trim(),
      mobileNumber: mobileNumber ? mobileNumber.trim() : undefined,
    };

    const res = await updateProfile(data);
    
    if (res.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(res.error || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsLoading(true);

    const data: TenantSettingsFormData = {
      currency,
      language
    };

    const res = await updateTenantSettings(data);
    
    if (res.success) {
      toast.success("Application preferences updated successfully!");
    } else {
      toast.error(res.error || "Failed to update preferences");
    }
    setSettingsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto items-start">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Personal Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Update your personal information and contact details.</p>
        </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          <div className="max-w-lg space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" defaultValue={initialUser.name || ""} placeholder="Your Name"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 ${
                  validationErrors.name 
                    ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                    : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                }`} 
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" defaultValue={initialUser.email || ""} disabled
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed directly. Contact support.</p>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">+91</span>
                </div>
                <input type="tel" id="mobileNumber" name="mobileNumber" defaultValue={initialUser.mobileNumber || ""} placeholder="9876543210" maxLength={10}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 ${
                    validationErrors.mobileNumber 
                      ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                      : "border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`} 
                />
              </div>
              {validationErrors.mobileNumber && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {validationErrors.mobileNumber}
                </p>
              )}
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={loading}
              className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 hover:bg-primary-800 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20'}`}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>

      {(initialUser.role === "OWNER" || initialUser.role === "ADMIN") && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Application Preferences</h2>
            <p className="text-sm text-gray-500 mt-1">Set the default currency and language for your entire company.</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              
              <div className="w-full space-y-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-bold text-gray-700 mb-1">Currency Symbol</label>
                  <div className="relative">
                    <select 
                      id="currency" 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                    >
                      <option value="INR">Rupee (₹ INR)</option>
                      <option value="USD">US Dollar ($ USD)</option>
                      <option value="SGD">Singapore Dollar (S$ SGD)</option>
                      <option value="AED">UAE Dirham (د.إ AED)</option>
                      <option value="GBP">British Pound (£ GBP)</option>
                      <option value="EUR">Euro (€ EUR)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-bold text-gray-700 mb-1">Application Language</label>
                  <div className="relative">
                    <select 
                      id="language" 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={settingsLoading}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 hover:bg-primary-800 transition-all flex items-center gap-2 ${settingsLoading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20'}`}>
                  {settingsLoading ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
