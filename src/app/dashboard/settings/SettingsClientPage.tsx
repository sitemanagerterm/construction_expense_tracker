"use client";

import React, { useState } from "react";
import { updateProfile, ProfileFormData, updateTenantSettings, TenantSettingsFormData, updateTenantInformation, TenantInfoFormData } from "@/app/actions/settings";
import toast from "react-hot-toast";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { saveTenantRole, deleteTenantRole, RoleFormData } from "@/app/actions/roles";
import { useRouter } from "next/navigation";

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

export type RoleData = {
  id: string;
  name: string;
  description: string | null;
  permissions: string;
  isDefault: boolean;
  _count: { users: number };
};

type ValidationErrors = {
  name?: string;
  mobileNumber?: string;
};

export const PERMISSIONS_LIST = [
  { id: "projects.view", label: "View Projects", module: "Projects" },
  { id: "projects.add", label: "Add Project", module: "Projects" },
  { id: "projects.edit", label: "Edit Project", module: "Projects" },
  { id: "projects.delete", label: "Delete Project", module: "Projects" },
  { id: "projects.view_value", label: "View Project Value/Budget", module: "Projects" },
  { id: "expenses.view", label: "View Expenses", module: "Expenses" },
  { id: "expenses.add", label: "Add Expense", module: "Expenses" },
  { id: "expenses.edit", label: "Edit Expense", module: "Expenses" },
  { id: "expenses.delete", label: "Delete Expense", module: "Expenses" },
  { id: "credits.view", label: "View Credits", module: "Credits" },
  { id: "credits.add", label: "Add Credit", module: "Credits" },
  { id: "credits.edit", label: "Edit Credit", module: "Credits" },
  { id: "credits.delete", label: "Delete Credit", module: "Credits" },
  { id: "staff.view", label: "View Staff", module: "Staff" },
  { id: "staff.add", label: "Add Staff", module: "Staff" },
  { id: "staff.edit", label: "Edit Staff", module: "Staff" },
  { id: "staff.delete", label: "Delete Staff", module: "Staff" },
  { id: "audit_log.view", label: "View Audit Logs", module: "Audit Logs" },
  { id: "settings.view", label: "View Settings", module: "Settings" },
  { id: "settings.edit", label: "Edit Settings", module: "Settings" },
];

export default function SettingsClientPage({ initialUser, initialRoles = [] }: { initialUser: UserData, initialRoles?: RoleData[] }) {
  const [activeTab, setActiveTab] = useState<"general" | "roles">("general");
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [tenantLoading, setTenantLoading] = useState(false);
  
  // Roles State
  const router = useRouter();
  const [roles, setRoles] = useState<RoleData[]>(initialRoles);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [roleSaving, setRoleSaving] = useState(false);
  
  React.useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);
  
  // Role Form State
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

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
    setRoleName("");
    setRoleDescription("");
    setRolePermissions([]);
    setRoleModalOpen(true);
  };

  const openEditRoleModal = (role: RoleData) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || "");
    try {
      setRolePermissions(JSON.parse(role.permissions));
    } catch {
      setRolePermissions([]);
    }
    setRoleModalOpen(true);
  };

  const togglePermission = (id: string) => {
    setRolePermissions(prev => {
      const isCurrentlyOn = prev.includes(id);
      
      if (isCurrentlyOn) {
        // Turning OFF
        let next = prev.filter(p => p !== id);
        
        // If turning OFF a "view" permission, automatically turn off add/edit/delete for that module
        if (id.endsWith('.view')) {
          const prefix = id.split('.')[0];
          next = next.filter(p => !p.startsWith(`${prefix}.`));
        }
        return next;
      } else {
        // Turning ON
        let next = [...prev, id];
        
        // If turning ON add/edit/delete, automatically ensure "view" is ON for that module
        if (id.includes('.') && !id.endsWith('.view')) {
          const prefix = id.split('.')[0];
          const viewId = `${prefix}.view`;
          if (!next.includes(viewId)) {
            next.push(viewId);
          }
        }
        return next;
      }
    });
  };

  const handleSaveRole = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (rolePermissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    setRoleSaving(true);
    const res = await saveTenantRole({
      id: editingRole?.id,
      name: roleName.trim(),
      description: roleDescription.trim(),
      permissions: rolePermissions
    });

    if (res.success) {
      toast.success(editingRole ? "Role updated!" : "Role created!");
      setRoleModalOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save role");
    }
    setRoleSaving(false);
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden lg:col-span-2">
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
        </div>
      )}

      {activeTab === "roles" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Role Settings</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create custom roles and manage module-based permissions.</p>
            </div>
            <button onClick={openNewRoleModal} className="bg-primary-900 dark:bg-accent text-white px-4 py-2 rounded-xl font-bold text-sm">
              + Create Role
            </button>
          </div>
          <div className="p-0">
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
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{role.name}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-slate-400">{role.description || "-"}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-slate-300">
                      <span className="bg-primary-50 dark:bg-accent-900/30 text-primary-700 dark:text-accent-400 py-1 px-2.5 rounded-lg font-bold text-xs">
                        {role._count.users} Users
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditRoleModal(role)} className="text-blue-600 hover:text-blue-800 text-sm font-bold mr-4">Edit</button>
                      <button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-800 text-sm font-bold disabled:opacity-50" disabled={role._count.users > 0}>Delete</button>
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
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button onClick={() => setRoleModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Role Name <span className="text-red-500">*</span></label>
                  <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Accountant, Site Supervisor"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">Description</label>
                  <input type="text" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="What can this role do?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white" 
                  />
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Module Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map(module => (
                  <div key={module} className="bg-gray-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-gray-100 dark:border-slate-800">
                    <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">{module}</h4>
                    <div className="space-y-3">
                      {PERMISSIONS_LIST.filter(p => p.module === module).map(p => (
                        <div key={p.id} className="flex items-center justify-between">
                          <label htmlFor={p.id} className="text-sm text-gray-600 dark:text-slate-400 font-medium cursor-pointer flex-1">
                            {p.label}
                          </label>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={rolePermissions.includes(p.id)}
                            onClick={() => togglePermission(p.id)}
                            className={`${
                              rolePermissions.includes(p.id) ? 'bg-primary-600 dark:bg-accent' : 'bg-gray-300 dark:bg-slate-700'
                            } relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                          >
                            <span className={`${rolePermissions.includes(p.id) ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/80 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setRoleModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveRole} disabled={roleSaving} className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-accent dark:hover:bg-accent-600 transition-colors flex items-center gap-2 ${roleSaving ? 'opacity-70 cursor-wait' : ''}`}>
                {roleSaving ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
