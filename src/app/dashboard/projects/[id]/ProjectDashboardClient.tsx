"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency, getCurrencySymbol } from "@/lib/utils";
import { motion } from "framer-motion";
import CreditHistoryModal from "@/components/projects/CreditHistoryModal";
import AddExpenseModal from "@/components/projects/AddExpenseModal";
import ProjectReportModal from "@/components/projects/ProjectReportModal";
import ExpenseHistoryModal from "@/components/projects/ExpenseHistoryModal";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import { addCredit, addExpenses, updateProjectBudget } from "../actions";
import { deleteExpense, updateExpense } from "@/app/actions/expenses";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// This is a placeholder structure based on the video. 
// We will refine the layout, add the modals, and implement the real actions later.

export default function ProjectDashboardClient({ project, allProjects, currency }: any) {
  const { t } = useTenantPreferences();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExpenseHistoryModalOpen, setIsExpenseHistoryModalOpen] = useState(false);
  const [isProjectFormModalOpen, setIsProjectFormModalOpen] = useState(false);
  
  // Inline Budget Edit State
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState("");
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);
  
  // Custom Dialog States
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<any | null>(null);
  const [editAmountValue, setEditAmountValue] = useState("");
  const [editReasonValue, setEditReasonValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  
  const handleAddCredit = async (data: any) => {
    try {
      await addCredit(data);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Failed to add credit");
      throw error; // re-throw to allow the modal to know it failed
    }
  };

  const handleAddExpenses = async (projectId: string, expenses: any[]) => {
    try {
      await addExpenses(projectId, expenses);
      toast.success(t('expense_added') || "Expenses added successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(t('expense_added_err') || error.message || "Failed to add expenses");
    }
  };

  const handleSaveBudget = async () => {
    setIsUpdatingBudget(true);
    const newBudget = parseFloat(budgetInputValue) || 0;
    try {
      await updateProjectBudget(project.id, newBudget);
      setIsEditingBudget(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update budget");
    } finally {
      setIsUpdatingBudget(false);
    }
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      setIsDeleting(true);
      try {
        const res = await deleteExpense(expenseToDelete, "Deleted from dashboard");
        if (res.success) {
          toast.success(t('expense_deleted') || "Expense deleted successfully");
          setExpenseToDelete(null);
          router.refresh();
        } else {
          toast.error(t('expense_deleted_err') || res.error || "Failed to delete expense");
        }
      } catch (error: any) {
        toast.error(t('expense_deleted_err') || error.message || "Failed to delete expense");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const confirmEditExpense = async () => {
    if (expenseToEdit && editAmountValue && editReasonValue.trim()) {
      const newAmount = Number(editAmountValue);
      if (!isNaN(newAmount)) {
        try {
          const res = await updateExpense(expenseToEdit.id, { amount: newAmount }, editReasonValue.trim());
          if (res.success) {
            toast.success(t('expense_updated') || "Expense updated successfully");
            setExpenseToEdit(null);
            setEditAmountValue("");
            setEditReasonValue("");
            router.refresh();
          } else {
            toast.error(t('expense_updated_err') || res.error || "Failed to update expense");
          }
        } catch (error: any) {
          toast.error(t('expense_updated_err') || error.message || "Failed to update expense");
        }
      }
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
  };

  const handleEditExpense = (expense: any) => {
    setExpenseToEdit(expense);
    setEditAmountValue(expense.amount ? expense.amount.toString() : "");
    setEditReasonValue("");
  };
  
  // Calculate Totals safely handling potentially undefined arrays
  const expensesList = project.expenses || [];
  const creditsList = project.credits || [];
  
  const totalExpenses = expensesList.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
  const totalCredits = creditsList.reduce((sum: number, cred: any) => sum + (cred.amount || 0), 0);
  
  const remainingBalance = totalCredits - totalExpenses;
  
  // Unique Categories
  const uniqueCategories = ["ALL", ...Array.from(new Set(expensesList.map((e: any) => e.category)))];
  const filteredExpenses = selectedCategory === "ALL" 
    ? expensesList 
    : expensesList.filter((e: any) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 relative z-50">
          <Link href="/dashboard/projects" className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 font-bold shrink-0 border border-accent-100 transition-transform hover:scale-105 active:scale-95">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </Link>
          <div className="relative">
            <div 
              className="cursor-pointer group flex flex-col justify-center px-3 py-1.5 -ml-2 rounded-xl hover:bg-gray-50 transition-colors" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('project_label')}</p>
                <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${project.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {project.status === 'ACTIVE' ? t('active') : t('completed')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">{project.name}</h1>
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            {/* Project Switcher Dropdown */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); }}></div>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-64 overflow-y-auto py-2">
                    {allProjects.map((p: any) => (
                      <a 
                        key={p.id} 
                        href={`/dashboard/projects/${p.id}`} 
                        onClick={() => setIsDropdownOpen(false)}
                        className={`block px-5 py-3.5 text-[15px] transition-colors ${p.id === project.id ? 'bg-accent-50 text-accent-500 font-bold' : 'text-gray-700 font-semibold hover:bg-gray-50'}`}
                      >
                        {p.name}
                      </a>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsProjectFormModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-5 py-3.5 border-t border-gray-50 text-[15px] font-bold text-accent-500 hover:bg-accent-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    {t('new_project')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm relative z-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            
            {/* 3-dot Menu Dropdown */}
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { setIsReportModalOpen(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-5 py-3.5 text-[13px] whitespace-nowrap font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    {t('view_report')}
                  </button>
                  <button 
                    onClick={async () => {
                      setIsMenuOpen(false);
                      const { toggleProjectStatus } = await import("../actions");
                      await toggleProjectStatus(project.id, project.status);
                    }}
                    className="w-full text-left px-5 py-3.5 text-[13px] whitespace-nowrap font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-50"
                  >
                    {project.status === "ACTIVE" ? (
                      <>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        {t('mark_as_completed')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        {t('mark_as_active')}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 w-full max-w-5xl mx-auto space-y-6">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Project Value Inline Edit Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center h-full">
          <div className="w-full mr-4">
            <p className="text-gray-700 text-[11px] font-bold mb-1 uppercase tracking-wider">{t('project_value')}</p>
            {isEditingBudget ? (
              <div className="flex items-center mt-1 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-accent-500/20 focus-within:border-accent-500 focus-within:bg-white transition-all w-full">
                <span className="pl-3 pr-1 text-gray-400 font-bold">{getCurrencySymbol(currency)}</span>
                <input 
                  type="number"
                  value={budgetInputValue}
                  onChange={(e) => setBudgetInputValue(e.target.value)}
                  disabled={isUpdatingBudget}
                  autoFocus
                  className="w-full py-2 pr-3 bg-transparent border-none focus:outline-none focus:ring-0 font-bold text-gray-900 text-xl"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(project.budget || 0, currency)}</p>
            )}
          </div>
          
          <div className="shrink-0 flex gap-2 self-end mb-1">
            {isEditingBudget ? (
              <>
                <button 
                  onClick={handleSaveBudget}
                  disabled={isUpdatingBudget}
                  className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
                >
                  {isUpdatingBudget ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </button>
                <button 
                  onClick={() => setIsEditingBudget(false)}
                  disabled={isUpdatingBudget}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border border-gray-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setBudgetInputValue(project.budget ? project.budget.toString() : "");
                  setIsEditingBudget(true);
                }}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            )}
          </div>
        </div>

        {/* Amount Received / Credit */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-full">
          <p className="text-gray-700 text-[11px] font-bold mb-1 uppercase tracking-wider">{t('credit_received')}</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalCredits, currency)}</p>
            <button 
              onClick={() => setIsCreditModalOpen(true)}
              className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
            >
              + {t('add_credit')}
            </button>
          </div>
        </div>

        {/* Expenses Overview */}
          <div 
            onClick={() => setIsExpenseHistoryModalOpen(true)}
            className="bg-accent-50 p-5 rounded-2xl border border-accent-100 cursor-pointer hover:bg-accent-100 transition-colors flex justify-between items-center group h-full"
          >
            <div>
              <p className="text-accent-700 text-[10px] font-bold mb-1 uppercase tracking-wider">{t('total_expenses')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent-700">{formatCurrency(totalExpenses, currency)}</p>
            </div>
            <div className="text-accent-600 group-hover:text-accent-800 transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border flex flex-col justify-center h-full ${remainingBalance < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <p className={`text-[11px] font-bold mb-1 uppercase tracking-wider ${remainingBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {remainingBalance < 0 ? 'Project Loss' : 'Project Profit'}
            </p>
            <div className="flex items-end justify-between">
              <p className={`text-2xl sm:text-3xl font-bold ${remainingBalance < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {remainingBalance < 0 ? '-' : '+'}{formatCurrency(Math.abs(remainingBalance), currency)}
              </p>
              {project.budget > 0 && (
                <div className={`flex items-center gap-0.5 pb-0.5 text-sm font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {remainingBalance < 0 ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  )}
                  <span>{Math.abs((remainingBalance / project.budget) * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {project.expenses.length === 0 ? (
              <p className="p-5 text-center text-gray-500 text-sm font-medium">{t('no_expenses_yet')}</p>
            ) : (
              project.expenses.slice(0, 5).map((exp: any, idx: number) => (
                <div key={idx} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <p className="font-bold text-gray-900 uppercase tracking-wide text-sm">{exp.category}</p>
                  <p className="font-bold text-accent-500 text-lg">{formatCurrency(exp.amount, currency)}</p>
                </div>
              ))
            )}
            
            {/* The Floating Add Expense Button */}
            <div className="p-4 bg-white sticky bottom-0 border-t border-gray-100">
              <button 
                onClick={() => setIsExpenseModalOpen(true)}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-accent-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                {t('add_expense')}
              </button>
            </div>
          </div>
        </div>

      </div>

      <CreditHistoryModal 
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        project={project}
        currency={currency}
        onAddCredit={handleAddCredit}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        projectId={project.id}
        currency={currency}
        onAddExpenses={handleAddExpenses}
      />

      <ExpenseHistoryModal
        isOpen={isExpenseHistoryModalOpen}
        onClose={() => setIsExpenseHistoryModalOpen(false)}
        project={project}
        currency={currency}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      <ProjectFormModal
        isOpen={isProjectFormModalOpen}
        onClose={() => setIsProjectFormModalOpen(false)}
        onSuccess={(newProject: any) => {
          setIsProjectFormModalOpen(false);
          router.push(`/dashboard/projects/${newProject.id}`);
        }}
      />

      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={project}
        currency={currency}
      />

      {/* Error Message Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-2xl shadow-none sm:shadow-xl p-6 text-center flex flex-col sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('error') || "Error"}</h3>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">{t('dismiss') || "Dismiss"}</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-fade-in" onClick={() => setExpenseToDelete(null)}>
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-2xl shadow-none sm:shadow-xl overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('delete_expense') || "Delete Expense"}</h3>
              <p className="text-sm text-gray-500 mb-6">{t('delete_expense_confirm') || "Are you sure you want to delete this expense? It will be removed or moved to the audit logs."}</p>
              <div className="flex gap-3">
                <button onClick={() => setExpenseToDelete(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">{t('cancel') || "Cancel"}</button>
                <button onClick={confirmDeleteExpense} disabled={isDeleting} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50">
                  {isDeleting ? (t('processing') || "Processing...") : (t('delete') || "Delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {expenseToEdit && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-2xl shadow-none sm:shadow-xl p-6 flex flex-col sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('edit_expense') || "Edit Expense"}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('edit_expense_desc') || "Enter a new amount and reason for this expense."}</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('new_amount') || "New Amount"}</label>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-accent-500/20 focus-within:border-accent-500 focus-within:bg-white transition-all w-full">
                <span className="pl-3 pr-1 text-gray-400 font-bold">{getCurrencySymbol(currency)}</span>
                <input 
                  type="number"
                  value={editAmountValue}
                  onChange={(e) => setEditAmountValue(e.target.value)}
                  autoFocus
                  className="w-full py-2 pr-3 bg-transparent border-none focus:outline-none focus:ring-0 font-bold text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('reason_for_edit') || "Reason for Edit"} *</label>
              <textarea
                value={editReasonValue}
                onChange={(e) => setEditReasonValue(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 resize-none h-20"
                placeholder={t('reason_for_edit_placeholder') || "e.g. Corrected amount, fixing typo..."}
              ></textarea>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setExpenseToEdit(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">{t('cancel') || "Cancel"}</button>
              <button onClick={confirmEditExpense} disabled={!editReasonValue.trim()} className="flex-1 py-2.5 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{t('save_changes') || "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
