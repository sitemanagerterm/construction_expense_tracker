"use client";

import React, { useState, useEffect } from "react";
import { addStaff, updateStaff, checkMobileNumberExists, StaffFormData } from "@/app/actions/staff";
import toast from "react-hot-toast";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import RoleModal, { RoleData, PERMISSIONS_LIST } from "@/components/settings/RoleModal";
import { useRouter } from "next/navigation";

type AddStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: { id: string; name: string | null; mobileNumber: string | null; pin: string | null; tenantRoleId?: string | null; allocatedProjects?: { id: string }[] } | null;
  roles?: any[];
  activeProjects?: { id: string; name: string }[];
};

type ValidationErrors = {
  name?: string;
  mobileNumber?: string;
  pin?: string;
};

export default function AddStaffModal({ isOpen, onClose, onSuccess, editData, roles = [], activeProjects = [] }: AddStaffModalProps) {
  const { t } = useTenantPreferences();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localRoles, setLocalRoles] = useState<any[]>(roles);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [mobileInput, setMobileInput] = useState("");

  const [allocationMode, setAllocationMode] = useState<"ALL" | "SPECIFIC">("SPECIFIC");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

  useEffect(() => {
    setLocalRoles(roles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, roles?.length]);

  useEffect(() => {
    if (isOpen) {
      setMobileInput(editData?.mobileNumber || "");
      setSelectedRole(editData?.tenantRoleId || "");
      setValidationErrors({});
      setError("");
      
      if (editData?.allocatedProjects && editData.allocatedProjects.length > 0) {
        if (editData.allocatedProjects.length === activeProjects.length && activeProjects.length > 0) {
          setAllocationMode("ALL");
          setSelectedProjects(activeProjects.map(p => p.id));
        } else {
          setAllocationMode("SPECIFIC");
          setSelectedProjects(editData.allocatedProjects.map(p => p.id));
        }
      } else {
        setAllocationMode("SPECIFIC");
        setSelectedProjects([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData]);

  useEffect(() => {
    if (mobileInput.length === 10 && mobileInput !== editData?.mobileNumber) {
      const timer = setTimeout(async () => {
        const res = await checkMobileNumberExists(mobileInput);
        if (res.success && res.exists) {
          setValidationErrors(prev => ({ ...prev, mobileNumber: "This mobile number is already registered in the system." }));
        } else {
          setValidationErrors(prev => ({ ...prev, mobileNumber: undefined }));
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    } else {
      // Clear inline mobile validation error if length is not 10 (unless it's empty, in which case we don't show the exists error anyway)
      if (validationErrors.mobileNumber === "This mobile number is already registered in the system.") {
        setValidationErrors(prev => ({ ...prev, mobileNumber: undefined }));
      }
    }
  }, [mobileInput]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const pin = formData.get("pin") as string;
    const tenantRoleId = formData.get("tenantRoleId") as string;

    // Custom Validation
    let currentErrors: ValidationErrors = {};
    
    if (!name || name.trim() === "") {
      currentErrors.name = "Please enter staff name.";
    }
    
    if (!mobileNumber || mobileNumber.trim() === "") {
      currentErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      currentErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }

    if (!pin || pin.trim() === "") {
      currentErrors.pin = "PIN is required.";
    } else if (!/^\d{4}$/.test(pin.trim())) {
      currentErrors.pin = "PIN must be exactly 4 digits.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setValidationErrors(currentErrors);
      setLoading(false);
      return;
    }

    const data: StaffFormData = {
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      pin: pin.trim(),
      tenantRoleId: tenantRoleId || undefined,
      allocatedProjectIds: allocationMode === "ALL" ? activeProjects.map(p => p.id) : selectedProjects,
    };

    const res = editData 
      ? await updateStaff(editData.id, data) 
      : await addStaff(data);
    
    if (res.success) {
      toast.success(editData ? "Staff updated successfully" : "Staff member added successfully");
      onSuccess();
      onClose();
    } else {
      setError(res.error || (editData ? "Failed to update staff" : "Failed to add staff"));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 bg-white sm:bg-slate-900/50 dark:bg-slate-900 sm:dark:bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-2xl shadow-none sm:shadow-xl overflow-hidden flex flex-col scale-100 sm:max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editData ? (t('edit_staff_member') || "Edit Staff Member") : (t('add_staff_member') || "Add Staff Member")}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 focus:outline-none transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="staff-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('full_name') || "Full Name"} <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" placeholder="e.g. Ramesh Kumar"
                defaultValue={editData?.name || ""}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 ${
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
              <label htmlFor="mobileNumber" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('mobile_number_login_id') || "Mobile Number (Login ID)"} <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">+91</span>
                </div>
                <input type="tel" id="mobileNumber" name="mobileNumber" placeholder="9876543210" maxLength={10}
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 ${
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

            <div>
              <label htmlFor="pin" className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('login_pin_4_digit') || "4-Digit Login PIN"} <span className="text-red-500">*</span></label>
              <input type="text" id="pin" name="pin" placeholder="1234" maxLength={4}
                defaultValue={editData?.pin || ""}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800 tracking-widest ${
                  validationErrors.pin
                    ? "border-red-500 bg-red-50/30 dark:bg-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                    : "border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20"
                }`} 
              />
              {validationErrors.pin && (
                <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {validationErrors.pin}
                </p>
              )}
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-1.5">{t('staff_login_help') || "Staff will use their mobile number and this PIN to login."}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="tenantRoleId" className="block text-sm font-bold text-gray-700 dark:text-slate-300">Assign Role (Optional)</label>
                <button type="button" onClick={() => setIsRoleModalOpen(true)} className="text-xs font-bold text-primary-600 dark:text-accent-400 hover:underline hover:text-primary-700 dark:hover:text-accent-300 transition-colors">
                  + Create New Role
                </button>
              </div>
              <div className="relative">
                <select 
                  id="tenantRoleId" 
                  name="tenantRoleId"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white appearance-none pr-10"
                >
                  <option value="">No Role (Default Staff)</option>
                  {localRoles.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <svg className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              {selectedRole ? (
                <div className="mt-2.5 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs border border-gray-100 dark:border-slate-700/50">
                  <div className="font-bold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    Role Permissions:
                  </div>
                  {(() => {
                    const role = localRoles.find(r => r.id === selectedRole);
                    if (!role) return <span className="text-gray-500">None</span>;
                    try {
                      const perms = JSON.parse(role.permissions);
                      if (!Array.isArray(perms) || perms.length === 0) return <span className="text-gray-500">No specific permissions.</span>;
                      return (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {perms.filter((p: string) => !p.startsWith('party.')).map((p: string) => {
                              // Normalize legacy singular keys to match current plural keys in PERMISSIONS_LIST
                              const normalizedP = p
                                .replace(/^project\./, 'projects.')
                                .replace(/^expense\./, 'expenses.')
                                .replace(/^credit\./, 'credits.');
                                
                              const permDef = PERMISSIONS_LIST.find(pl => pl.id === normalizedP);
                              
                              // Fallback formatter for unknown keys (e.g. "custom.action" -> "Custom Action")
                              const fallbackLabel = p.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                              
                              return (
                                <span key={p} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-600 dark:text-slate-300 shadow-sm">
                                  {permDef ? permDef.label : (p.includes('.') ? fallbackLabel : p)}
                                </span>
                              );
                            })}
                        </div>
                      );
                    } catch {
                      return <span className="text-red-500">Invalid permissions format.</span>;
                    }
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-slate-400 text-xs mt-1.5">Roles give users specific module permissions.</p>
              )}
            </div>

            {/* Site Allocation Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">Site Allocation</label>
              
              {activeProjects.length === 0 ? (
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl text-sm">
                  No active sites found. The staff member will be created, and you can allocate sites later.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="allocationMode" 
                        value="ALL" 
                        checked={allocationMode === "ALL"}
                        onChange={() => setAllocationMode("ALL")}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">All Active Sites</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="allocationMode" 
                        value="SPECIFIC" 
                        checked={allocationMode === "SPECIFIC"}
                        onChange={() => setAllocationMode("SPECIFIC")}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Specific Sites</span>
                    </label>
                  </div>

                  {allocationMode === "SPECIFIC" && (() => {
                    const filteredProjects = activeProjects.filter(p => 
                      p.name.toLowerCase().includes(siteSearchQuery.toLowerCase())
                    );
                    const allFilteredSelected = filteredProjects.length > 0 && filteredProjects.every(p => selectedProjects.includes(p.id));

                    return (
                      <div className="flex flex-col gap-3">
                        {/* Search and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                          <div className="relative flex-1">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input 
                              type="text"
                              placeholder="Search sites..."
                              value={siteSearchQuery}
                              onChange={(e) => setSiteSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-800 dark:text-white"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2.5 py-1 rounded-md">
                              {selectedProjects.length} selected
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (allFilteredSelected) {
                                  // Deselect all filtered
                                  const filteredIds = filteredProjects.map(p => p.id);
                                  setSelectedProjects(prev => prev.filter(id => !filteredIds.includes(id)));
                                } else {
                                  // Select all filtered
                                  const filteredIds = filteredProjects.map(p => p.id);
                                  setSelectedProjects(prev => Array.from(new Set([...prev, ...filteredIds])));
                                }
                              }}
                              className="text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              {allFilteredSelected ? "Deselect All" : "Select All"}
                            </button>
                          </div>
                        </div>

                        {/* Project List */}
                        <div className="max-h-48 overflow-y-auto p-1 space-y-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl custom-scrollbar">
                          {filteredProjects.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-slate-400">
                              No sites match your search.
                            </div>
                          ) : (
                            filteredProjects.map(project => (
                              <label 
                                key={project.id} 
                                className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-colors border select-none ${
                                  selectedProjects.includes(project.id) 
                                    ? "bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20" 
                                    : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-800"
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={selectedProjects.includes(project.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedProjects(prev => [...prev, project.id]);
                                    } else {
                                      setSelectedProjects(prev => prev.filter(id => id !== project.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
                                />
                                <span className={`text-sm font-medium ${selectedProjects.includes(project.id) ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-slate-300'}`}>
                                  {project.name}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 pb-8 sm:pb-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0 mt-auto">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl font-semibold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            {t('cancel') || "Cancel"}
          </button>
          <button type="submit" form="staff-form" disabled={loading}
            className={`flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl font-bold text-white bg-primary-900 dark:bg-accent hover:bg-primary-800 dark:hover:bg-accent-600 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20 dark:shadow-accent-500/20'}`}>
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving') || "Saving..."}
              </>
            ) : (editData ? (t('update_staff') || "Update Staff") : (t('add_staff') || "Add Staff"))}
          </button>
        </div>

      </div>
      
      <RoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        onSuccess={(newRole) => {
          setLocalRoles(prev => [...prev, newRole]);
          setSelectedRole(newRole.id);
          router.refresh();
        }} 
        editingRole={null} 
      />
    </div>
  );
}
