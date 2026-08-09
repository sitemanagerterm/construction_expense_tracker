"use client";

import React, { useState, useEffect } from "react";
import { saveTenantRole, RoleFormData } from "@/app/actions/roles";
import toast from "react-hot-toast";

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
  { id: "party.view", label: "View Parties", module: "Parties" },
  { id: "party.add", label: "Add Party", module: "Parties" },
  { id: "party.edit", label: "Edit Party", module: "Parties" },
  { id: "party.delete", label: "Delete Party", module: "Parties" },
  { id: "staff.view", label: "View Staff", module: "Staff" },
  { id: "staff.add", label: "Add Staff", module: "Staff" },
  { id: "staff.edit", label: "Edit Staff", module: "Staff" },
  { id: "staff.delete", label: "Delete Staff", module: "Staff" },
  { id: "audit_log.view", label: "View Audit Logs", module: "Audit Logs" },
  { id: "settings.view", label: "View Settings", module: "Settings" },
  { id: "settings.edit", label: "Edit Settings", module: "Settings" },
];

export type RoleData = {
  id: string;
  name: string;
  description: string | null;
  permissions: string;
  isDefault: boolean;
  _count?: { users: number };
};

type RoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: RoleData) => void;
  editingRole: RoleData | null;
};

export default function RoleModal({ isOpen, onClose, onSuccess, editingRole }: RoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [roleSaving, setRoleSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingRole) {
        setRoleName(editingRole.name);
        setRoleDescription(editingRole.description || "");
        try {
          const perms = JSON.parse(editingRole.permissions);
          setRolePermissions(Array.isArray(perms) ? perms : []);
        } catch {
          setRolePermissions([]);
        }
      } else {
        setRoleName("");
        setRoleDescription("");
        setRolePermissions([]);
      }
    }
  }, [isOpen, editingRole]);

  if (!isOpen) return null;

  const modules = Array.from(new Set(PERMISSIONS_LIST.map(p => p.module)));

  const togglePermission = (id: string) => {
    setRolePermissions(prev => {
      const isCurrentlyOn = prev.includes(id);
      
      if (isCurrentlyOn) {
        let next = prev.filter(p => p !== id);
        if (id.endsWith('.view')) {
          const prefix = id.split('.')[0];
          next = next.filter(p => !p.startsWith(`${prefix}.`));
        }
        return next;
      } else {
        let next = [...prev, id];
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
      toast.error("Role Name is required");
      return;
    }
    if (rolePermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    setRoleSaving(true);
    const data: RoleFormData = {
      id: editingRole?.id,
      name: roleName.trim(),
      description: roleDescription.trim() || undefined,
      permissions: rolePermissions
    };

    const res: any = await saveTenantRole(data);
    
    if (res.success && res.role) {
      toast.success(res.message || "Role saved successfully");
      
      const newRole: RoleData = {
        ...res.role,
        _count: { users: 0 }
      };
      
      onSuccess(newRole);
      onClose();
    } else {
      toast.error(res.error || "Failed to save role");
    }
    setRoleSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingRole ? 'Edit Role' : 'Create New Role'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-white dark:bg-slate-800 rounded-full shadow-sm">
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
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSaveRole} disabled={roleSaving} className={`px-6 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-accent dark:hover:bg-accent-600 transition-colors flex items-center gap-2 ${roleSaving ? 'opacity-70 cursor-wait' : ''}`}>
            {roleSaving ? 'Saving...' : 'Save Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
