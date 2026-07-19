"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

interface ExpenseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  currency: string;
  userRole?: string;
  currentUserId?: string;
  onEdit?: (expense: any) => void;
  onDelete?: (expenseId: string) => void;
}

export default function ExpenseHistoryModal({ isOpen, onClose, project, currency, userRole, currentUserId, onEdit, onDelete }: ExpenseHistoryModalProps) {
  const { t } = useTenantPreferences();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("ALL");

  if (!isOpen) return null;

  const expensesList = project?.expenses || [];
  
  const totalExpenses = expensesList.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
  
  // Filter expenses before grouping
  const filteredForGrouping = selectedFilterCategory === "ALL" 
    ? expensesList 
    : expensesList.filter((e: any) => e.category === selectedFilterCategory);

  // Group expenses by date string
  const groupedExpenses = filteredForGrouping.reduce((acc: any, exp: any) => {
    const dateObj = new Date(exp.date);
    const dateKey = dateObj.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase();
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateObj,
        total: 0,
        items: []
      };
    }
    acc[dateKey].total += (exp.amount || 0);
    acc[dateKey].items.push(exp);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDateKeys = Object.keys(groupedExpenses).sort((a, b) => 
    groupedExpenses[b].date.getTime() - groupedExpenses[a].date.getTime()
  );

  const canEditDelete = (exp: any) => {
    if (userRole === "SUPER_ADMIN" || userRole === "OWNER") return true;
    if (userRole === "STAFF") {
      if (exp.userId !== currentUserId) return false;
      const today = new Date();
      const expenseDate = new Date(exp.createdAt || exp.date);
      return (
        today.getFullYear() === expenseDate.getFullYear() &&
        today.getMonth() === expenseDate.getMonth() &&
        today.getDate() === expenseDate.getDate()
      );
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] relative">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('all_expenses') || "All Expenses"}</h2>
            <p className="text-accent-500 text-lg mt-1 font-bold">
              <span className="text-gray-500 font-medium mr-2 text-base">{filteredForGrouping.length} {t('entries') || "entries"} &bull;</span>
              {formatCurrency(filteredForGrouping.reduce((s:number,e:any)=>s+(e.amount||0),0), currency)}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto shrink-0 bg-white border-b border-gray-100" style={{ scrollbarWidth: 'none' }}>
           <button onClick={() => setSelectedFilterCategory("ALL")} className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${selectedFilterCategory === "ALL" ? 'bg-accent-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t('all') || "All"}</button>
           {Array.from(new Set(expensesList.map((e: any) => e.category))).map((cat: any) => (
             <button 
               key={cat} 
               onClick={() => setSelectedFilterCategory(cat)}
               className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold capitalize transition-colors ${selectedFilterCategory === cat ? 'bg-accent-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Expenses List */}
        <div className="overflow-y-auto flex-grow p-4">
          <div className="space-y-6">
            {sortedDateKeys.length === 0 && (
              <p className="text-center text-gray-500 font-medium py-8">{t('no_expenses_found') || "No expenses found."}</p>
            )}
            {sortedDateKeys.map(dateKey => (
              <div key={dateKey}>
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="text-[11px] font-bold text-gray-500 tracking-widest">{dateKey}</h3>
                  <p className="text-sm font-bold text-slate-700">{formatCurrency(groupedExpenses[dateKey].total, currency)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                  {groupedExpenses[dateKey].items.map((exp: any, idx: number) => (
                    <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-gray-900 capitalize text-sm sm:text-base truncate">{t(exp.category.toLowerCase()) || exp.category}</p>
                        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium">
                          {new Date(exp.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                        </p>
                      </div>
                      <div className="flex items-center shrink-0">
                        <p className="font-bold text-gray-800 text-[14px] sm:text-[15px] text-right min-w-[70px] sm:min-w-[90px] pr-3 border-r border-gray-100 whitespace-nowrap">
                          {formatCurrency(exp.amount, currency)}
                        </p>
                        <div className="flex gap-1.5 sm:gap-2 pl-3">
                          {canEditDelete(exp) && (
                            <>
                              <button 
                                onClick={() => onEdit && onEdit(exp)}
                                className="p-1.5 sm:p-2 bg-white rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors shadow-sm border border-gray-100"
                                title="Edit"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button 
                                onClick={() => onDelete && onDelete(exp.id)}
                                className="p-1.5 sm:p-2 bg-white rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-gray-100"
                                title="Delete"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>



      </div>
    </div>
  );
}
