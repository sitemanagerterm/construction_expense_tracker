"use client";

import React, { useState } from "react";
import { updateProfile, ProfileFormData, updateTenantSettings, TenantSettingsFormData, updateTenantInformation, TenantInfoFormData } from "@/app/actions/settings";
import toast from "react-hot-toast";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { saveTenantRole, deleteTenantRole } from "@/app/actions/roles";
import { PERMISSIONS_LIST } from "@/components/settings/RoleModal";
import { useRouter, useSearchParams } from "next/navigation";
import RoleModal, { RoleData } from "@/components/settings/RoleModal";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  mobileNumber: string | null;
  role: string;
  tenant: { 
    name: string; 
    currency: string; 
    language: string;
    contactPerson?: string | null;
    mobileNo?: string | null;
    address?: string | null;
    pincode?: string | null;
    businessType?: string | null;
  } | null;
  tenantRole?: { permissions: string } | null;
};

// RoleData is now imported from RoleModal

export default function SettingsClientPage({ initialUser, initialRoles = [], plan = "PRO" }: { initialUser: UserData, initialRoles?: RoleData[], plan?: string }) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "roles" ? "roles" : "general";
  const [activeTab, setActiveTab] = useState<"general" | "roles">(initialTab);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(false);
type ValidationErrors = {
  [key: string]: string;
};

  // Roles State
  const router = useRouter();
  const [roles, setRoles] = useState<RoleData[]>(initialRoles);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  
  React.useEffect(() => {
    setRoles(initialRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRoles?.length]);
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const { t } = useTenantPreferences();
  
  const [currency, setCurrency] = useState(initialUser.tenant?.currency || "INR");
  const [language, setLanguage] = useState(initialUser.tenant?.language || "en");

  const canEditSettings = initialUser.role === 'OWNER' || initialUser.role === 'SUPER_ADMIN' || (initialUser.role === 'STAFF' && initialUser.tenantRole?.permissions?.includes('settings.edit'));

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

  const handleTenantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTenantLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: TenantInfoFormData = {
      name: (formData.get("name") as string).trim(),
      contactPerson: (formData.get("contactPerson") as string)?.trim() || undefined,
      mobileNo: (formData.get("mobileNo") as string)?.trim() || undefined,
      address: (formData.get("address") as string)?.trim() || undefined,
      pincode: (formData.get("pincode") as string)?.trim() || undefined,
      businessType: (formData.get("businessType") as string) || undefined,
    };

    if (!data.name) {
      toast.error("Company Name is required");
      setTenantLoading(false);
      return;
    }

    const res = await updateTenantInformation(data);
    
    if (res.success) {
      toast.success("Site Owner Information updated successfully!");
    } else {
      toast.error(res.error || "Failed to update information");
    }
    setTenantLoading(false);
  };

  const openNewRoleModal = () => {
    setEditingRole(null);
    setRoleModalOpen(true);
  };

  const openEditRoleModal = (role: RoleData) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  const handleRoleSuccess = (savedRole: RoleData) => {
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === savedRole.id ? savedRole : r));
    } else {
      setRoles(prev => [...prev, savedRole]);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    const res = await deleteTenantRole(id);
    if (res.success) {
      toast.success("Role deleted!");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete role");
    }
  };

  const modules = Array.from(new Set(PERMISSIONS_LIST.map(p => p.module)));

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab("general")}
          className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-primary-600 text-primary-600 dark:border-accent dark:text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
        >
          General Settings
        </button>
        {(initialUser.role === "OWNER" || initialUser.role === "ADMIN") && (
          <button 
            onClick={() => setActiveTab("roles")}
            className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'roles' ? 'border-primary-600 text-primary-600 dark:border-accent dark:text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            Roles & Permissions
          </button>
        )}
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('personal_profile') || "Personal Profile"}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('personal_profile_desc') || "Update your personal information and contact details."}</p>
        </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          <div className="max-w-lg space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('full_name') || "Full Name"} <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" defaultValue={initialUser.name || ""} placeholder={t('full_name') || "Your Name"}
                disabled={!canEditSettings}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 ${
                  !canEditSettings ? "cursor-not-allowed opacity-70" : ""
                } ${
                  validationErrors.name 
                    ? "border-red-500 bg-red-50/30 dark:bg-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                    : "border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20"
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
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('email_address') || "Email Address"}</label>
              <input type="email" id="email" defaultValue={initialUser.email || ""} disabled
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 outline-none cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5">{t('email_desc') || "Email cannot be changed directly. Contact support."}</p>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('mobile_number') || "Mobile Number"}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">+91</span>
                </div>
                <input type="tel" id="mobileNumber" name="mobileNumber" defaultValue={initialUser.mobileNumber || ""} placeholder="9876543210" maxLength={10}
                  disabled={!canEditSettings}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 ${
                    !canEditSettings ? "cursor-not-allowed opacity-70" : ""
                  } ${
                    validationErrors.mobileNumber 
                      ? "border-red-500 bg-red-50/30 dark:bg-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                      : "border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20"
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
          
          {canEditSettings && (
            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
              <button type="submit" disabled={loading}
                className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 dark:bg-accent hover:bg-primary-800 dark:hover:bg-accent-600 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20 dark:shadow-accent-500/20'}`}>
                {loading ? (t('saving') || "Saving...") : (t('save_changes') || "Save Changes")}
              </button>
            </div>
          )}
        </form>
      </div>
      
      {(initialUser.role === "OWNER" || initialUser.role === "ADMIN") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('site_owner_info') || "Site Owner Information"}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('site_owner_info_desc') || "Update the company details provided during registration."}</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleTenantSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input type="text" id="company_name" name="name" defaultValue={initialUser.tenant?.name || ""} placeholder="Company Name" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" 
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Owner Name</label>
                  <input type="text" id="contactPerson" name="contactPerson" defaultValue={initialUser.tenant?.contactPerson || ""} placeholder="Ramesh Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" 
                  />
                </div>

                <div>
                  <label htmlFor="tenantMobileNo" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Company Phone</label>
                  <input type="tel" id="tenantMobileNo" name="mobileNo" defaultValue={initialUser.tenant?.mobileNo || ""} placeholder="Phone Number"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" 
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Business Type</label>
                  <div className="relative">
                    <select 
                      id="businessType" 
                      name="businessType"
                      defaultValue={initialUser.tenant?.businessType || ""}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select type</option>
                      <option value="general_contractor">General Contractor</option>
                      <option value="builder">Builder / Developer</option>
                      <option value="subcontractor">Subcontractor</option>
                      <option value="architect">Architect / Designer</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Company Address</label>
                  <input type="text" id="address" name="address" defaultValue={initialUser.tenant?.address || ""} placeholder="123 Main Street"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" 
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Pincode</label>
                  <input type="text" id="pincode" name="pincode" defaultValue={initialUser.tenant?.pincode || ""} placeholder="600001"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" 
                  />
                </div>

              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                <button type="submit" disabled={tenantLoading}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 dark:bg-accent hover:bg-primary-800 dark:hover:bg-accent-600 transition-all flex items-center gap-2 ${tenantLoading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20 dark:shadow-accent-500/20'}`}>
                  {tenantLoading ? (t('saving') || "Saving...") : (t('save_changes') || "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      <div className="space-y-6">

      {(initialUser.role === "OWNER" || initialUser.role === "ADMIN") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('app_preferences') || "Application Preferences"}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('app_preferences_desc') || "Set the default currency and language for your entire company."}</p>
        </div>

          <div className="p-6">
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              
              <div className="w-full space-y-6">
                <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('currency_symbol') || "Currency Symbol"}</label>
              <div className="relative">
                    <select 
                      id="currency" 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="INR">Rupee (₹ INR)</option>
                      <option value="USD">US Dollar ($ USD)</option>
                      <option value="SGD">Singapore Dollar (S$ SGD)</option>
                      <option value="AED">UAE Dirham (د.إ AED)</option>
                      <option value="GBP">British Pound (£ GBP)</option>
                      <option value="EUR">Euro (€ EUR)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('application_language') || "Application Language"}</label>
              <div className="relative">
                    <select 
                      id="language" 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                <button type="submit" disabled={settingsLoading}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-900 dark:bg-accent hover:bg-primary-800 dark:hover:bg-accent-600 transition-all flex items-center gap-2 ${settingsLoading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20 dark:shadow-accent-500/20'}`}>
                  {settingsLoading ? (t('saving') || "Saving...") : (t('save_changes') || "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Help & Support Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('Help & Support')}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{t('Contact us for queries, suggestions, or feedback.')}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full shrink-0">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('WhatsApp Support')}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{t('Quickest way to get help or share feedback')}</p>
              </div>
              <a href="https://wa.me/919025068407" target="_blank" rel="noreferrer" className="ml-auto px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors whitespace-nowrap shrink-0">
                {t('Chat Now')}
              </a>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-full shrink-0">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Email Us')}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{t('For detailed queries or suggestions')}</p>
              </div>
              <a href="mailto:support@mysitebook.in" className="ml-auto px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors whitespace-nowrap shrink-0">
                {t('Send Email')}
              </a>
            </div>
          </div>
        </div>

        </div>
      </div>
      )}

      {activeTab === "roles" && plan === "FREE" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden p-8 sm:p-12 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-accent-50 dark:bg-accent-900/30 rounded-full flex items-center justify-center text-accent-500 mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Roles & Permissions is a Pro Feature</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Upgrade to the Pro Plan to create custom roles and define exactly what each staff member can see and do on your account.
          </p>
          <a href="/pricing" className="inline-block px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold shadow-lg shadow-accent-500/30 transition-all active:scale-[0.98]">
            Upgrade to Pro - Just ₹299/mo
          </a>
        </div>
      )}

      {activeTab === "roles" && plan !== "FREE" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Role Settings</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create custom roles and manage module-based permissions.</p>
            </div>
            <button onClick={openNewRoleModal} className="w-full sm:w-auto bg-primary-900 dark:bg-accent text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity">
              + Create Role
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  <th className="p-4 font-bold">Role Name</th>
                  <th className="p-4 font-bold">Description</th>
                  <th className="p-4 font-bold">Assigned Users</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {roles.map(role => (
                  <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {role.name}
                        {role.isDefault && (
                          <span className="bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">Default</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-slate-400">{role.description || "-"}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-slate-300">
                      <span className="bg-primary-50 dark:bg-accent-900/30 text-primary-700 dark:text-accent-400 py-1 px-2.5 rounded-lg font-bold text-xs">
                        {role._count?.users || 0} Users
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {!role.isDefault ? (
                        <>
                          <button onClick={() => openEditRoleModal(role)} className="text-blue-600 hover:text-blue-800 text-sm font-bold mr-4">Edit</button>
                          <button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-800 text-sm font-bold disabled:opacity-50" disabled={(role._count?.users || 0) > 0}>Delete</button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">System Role</span>
                      )}
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-slate-400">No custom roles created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Modal */}
      <RoleModal 
        isOpen={roleModalOpen} 
        onClose={() => setRoleModalOpen(false)} 
        onSuccess={handleRoleSuccess} 
        editingRole={editingRole} 
      />

      {/* Global WhatsApp Floating Button */}
      <a
        href="https://wa.me/919025068407"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:scale-105 transition-all z-[60] flex items-center justify-center group"
        aria-label="Contact Support"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="absolute right-full mr-3 bg-gray-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Help & Support
        </span>
      </a>

    </div>
  );
}
