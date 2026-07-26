"use client";

import React, { useState } from "react";
import { createProject, updateProject, ProjectFormData } from "@/app/actions/projects";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { getCurrencySymbol } from "@/lib/utils";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProject: any) => void;
  editData?: any;
};

type ValidationErrors = {
  name?: string;
  budget?: string;
};

export default function ProjectFormModal({ isOpen, onClose, onSuccess, editData }: ProjectFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { currency, t } = useTenantPreferences();

  useEffect(() => {
    if (editData && isOpen) {
      setStartDate(editData.startDate ? new Date(editData.startDate) : null);
      setEndDate(editData.endDate ? new Date(editData.endDate) : null);
    } else if (isOpen) {
      setStartDate(null);
      setEndDate(null);
      setValidationErrors({});
      setError("");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const budgetStr = formData.get("budget") as string;
    
    // Custom Validation
    let currentErrors: ValidationErrors = {};
    if (!name || name.trim() === "") {
      currentErrors.name = "Please enter a project name.";
    }
    
    const budget = budgetStr ? parseFloat(budgetStr) : undefined;
    if (budgetStr && isNaN(budget!)) {
      currentErrors.budget = "Budget must be a valid number.";
    } else if (budget !== undefined && budget < 0) {
      currentErrors.budget = "Budget cannot be negative.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setValidationErrors(currentErrors);
      setLoading(false);
      return;
    }
    
    setValidationErrors({});

    const data: ProjectFormData = {
      name: name.trim(),
      description: formData.get("description") as string,
      clientName: formData.get("clientName") as string,
      budget: budget,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    let res;
    if (editData?.id) {
      res = await updateProject(editData.id, data);
    } else {
      res = await createProject(data);
    }
    
    if (res.success) {
      onSuccess(res.data);
      onClose();
    } else {
      setError(res.error || `Failed to ${editData ? 'update' : 'create'} project`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 dark:bg-slate-900 sm:dark:bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editData ? t('edit') : t('create_new_project')}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto overflow-x-hidden flex-grow">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('project_name')} <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" placeholder="E.g. Apollo Hospital Wing B"
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
              <label htmlFor="clientName" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('client_name')}</label>
              <input type="text" id="clientName" name="clientName" placeholder="E.g. Apollo Group"
                defaultValue={editData?.clientName || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('est_budget')} ({getCurrencySymbol(currency)})</label>
                <input type="number" id="budget" name="budget" placeholder="e.g. 5000" step="0.01" min="0"
                  defaultValue={editData?.budget || ""}
                  className={`w-full bg-gray-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-gray-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 transition-all no-spinners ${
                    validationErrors.budget
                      ? "border-red-500 bg-red-50/30 dark:bg-red-500/10 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-slate-700 focus:border-primary-500 dark:focus:border-accent-500"
                  }`} 
                />
                {validationErrors.budget && (
                  <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {validationErrors.budget}
                  </p>
                )}
              </div>
              <div>
              <label htmlFor="startDate" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('start_date')}</label>
              <div className="relative">
                <DatePicker 
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white"
                  wrapperClassName="w-full"
                  placeholderText={t('select_start_date') || "Select start date"}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                />
              </div>
            </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('completed_end_date') || "Completed / End Date"}</label>
              <DatePicker 
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white"
                wrapperClassName="w-full"
                placeholderText={t('select_completed_date') || "Select completed date (optional)"}
                dateFormat="MMMM d, yyyy"
                isClearable
                minDate={startDate || undefined}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-left text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">{t('description_notes') || "Description / Notes"}</label>
              <textarea id="description" name="description" rows={3} placeholder={t('add_details_site') || "Add any details about the site..."}
                defaultValue={editData?.description || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary-500 dark:focus:border-accent-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20 outline-none transition-all text-gray-900 dark:text-white resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 pb-8 sm:pb-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0 mt-auto">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl font-bold text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            {t('cancel')}
          </button>
          <button type="submit" form="project-form" disabled={loading}
            className={`flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl font-bold text-white bg-primary-900 dark:bg-accent hover:bg-primary-800 dark:hover:bg-accent-600 transition-all ${loading ? 'opacity-70 cursor-wait' : 'shadow-md shadow-primary-900/20 dark:shadow-accent-500/20'}`}>
            {loading ? "..." : (editData ? t('edit') : t('create_project'))}
          </button>
        </div>

      </div>
    </div>
  );
}
