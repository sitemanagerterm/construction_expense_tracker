"use client";

import React, { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

interface ExpenseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  currency: string;
  userRole?: string;
  currentUserId?: string;
  isCompleted?: boolean;
  onEdit?: (expense: any) => void;
  onDelete?: (expenseId: string) => void;
  canEditExpense?: boolean;
  canDeleteExpense?: boolean;
}

export default function ExpenseHistoryModal({ isOpen, onClose, project, currency, userRole, currentUserId, isCompleted, onEdit, onDelete, canEditExpense = false, canDeleteExpense = false }: ExpenseHistoryModalProps) {
  const { t } = useTenantPreferences();
  
  const today = new Date();
  const currentMonthYear = `${today.getMonth()}-${today.getFullYear()}`;
  
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("ALL");
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(currentMonthYear);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedFilterCategory("ALL");
      setSelectedMonthYear(`${new Date().getMonth()}-${new Date().getFullYear()}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const expensesList = project?.expenses || [];
  
  // Get all unique categories
  const categories = Array.from(new Set(expensesList.map((e: any) => e.category)));

  // Get all unique month/years for the dropdown
  const availableMonthYears = Array.from(new Set(expensesList.map((e: any) => {
    const d = new Date(e.date);
    return `${d.getMonth()}-${d.getFullYear()}`;
  }))) as string[];

  // Ensure current month is always available as an option
  if (!availableMonthYears.includes(currentMonthYear)) {
    availableMonthYears.push(currentMonthYear);
  }

  // Sort months descending
  availableMonthYears.sort((a: string, b: string) => {
    const [m1, y1] = a.split('-').map(Number);
    const [m2, y2] = b.split('-').map(Number);
    if (y1 !== y2) return y2 - y1;
    return m2 - m1;
  });

  const getMonthName = (monthStr: string) => {
    if (monthStr === "ALL") return t('all_time') || "All Time";
    const [m, y] = monthStr.split('-').map(Number);
    const date = new Date(y, m, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Filter expenses
  const filteredForGrouping = expensesList.filter((e: any) => {
    const d = new Date(e.date);
    const my = `${d.getMonth()}-${d.getFullYear()}`;
    const categoryMatch = selectedFilterCategory === "ALL" || e.category === selectedFilterCategory;
    const monthMatch = selectedMonthYear === "ALL" || my === selectedMonthYear;
    return categoryMatch && monthMatch;
  });

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

  const canEdit = (exp: any) => {
    if (isCompleted) return false;
    
    if (userRole === "SUPER_ADMIN" || userRole === "OWNER") return true;
    if (canEditExpense) return true;
    
    // Fallback original logic for staff without explicit 'edit any' permission
    if (userRole === "STAFF") {
      if (exp.userId !== currentUserId) return false;
      const today = new Date();
      const createdDate = exp.createdAt ? new Date(exp.createdAt) : new Date();
      return (
        today.getFullYear() === createdDate.getFullYear() &&
        today.getMonth() === createdDate.getMonth() &&
        today.getDate() === createdDate.getDate()
      );
    }
    return false;
  };

  const canDelete = (exp: any) => {
    if (isCompleted) return false;
    if (userRole === "SUPER_ADMIN" || userRole === "OWNER") return true;
    if (canDeleteExpense) return true;
    
    // Fallback logic for delete
    if (userRole === "STAFF") {
      if (exp.userId !== currentUserId) return false;
      const today = new Date();
      const createdDate = exp.createdAt ? new Date(exp.createdAt) : new Date();
      return (
        today.getFullYear() === createdDate.getFullYear() &&
        today.getMonth() === createdDate.getMonth() &&
        today.getDate() === createdDate.getDate()
      );
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 dark:bg-slate-900 dark:sm:bg-slate-900/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] relative border dark:border-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start bg-gray-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-200/80 dark:bg-slate-700/80 dark:text-slate-300 px-2 py-0.5 rounded-full line-clamp-1 max-w-[200px]">{project?.name || "Project"}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('all_expenses') || "All Expenses"}</h2>
            <p className="text-accent-500 dark:text-accent-400 text-lg mt-1 font-bold">
              <span className="text-gray-500 dark:text-slate-400 font-medium mr-2 text-base">{filteredForGrouping.length} {t('entries') || "entries"} &bull;</span>
              {formatCurrency(filteredForGrouping.reduce((s:number,e:any)=>s+(e.amount||0),0), currency)}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shrink-0">
           <div className="flex-1">
             <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('month') || "Month"}</label>
             <SearchableDropdown
               value={selectedMonthYear}
               options={[
                 { value: "ALL", label: t('all_time') || "All Time" },
                 ...availableMonthYears.map(my => ({ value: my, label: getMonthName(my) }))
               ]}
               onChange={setSelectedMonthYear}
               placeholder={t('month') || "Month"}
             />
           </div>
           
           <div className="flex-1">
             <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('category') || "Category"}</label>
             <SearchableDropdown
               value={selectedFilterCategory}
               options={[
                 { value: "ALL", label: t('all_categories') || "All Categories" },
                 ...categories.map((cat: any) => ({ value: cat, label: t(cat.toLowerCase()) || cat }))
               ]}
               onChange={setSelectedFilterCategory}
               placeholder={t('category') || "Category"}
             />
           </div>
        </div>

        {/* Expenses List */}
        <div className="overflow-y-auto flex-grow p-4">
          <div className="space-y-6">
            {sortedDateKeys.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 font-medium py-8">{t('no_expenses_found') || "No expenses found."}</p>
            )}
            {sortedDateKeys.map(dateKey => (
              <div key={dateKey}>
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="text-[11px] font-bold text-gray-500 dark:text-slate-400 tracking-widest">{dateKey}</h3>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(groupedExpenses[dateKey].total, currency)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
                  {groupedExpenses[dateKey].items.map((exp: any, idx: number) => (
                    <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base capitalize truncate">
                          {t(exp.category.toLowerCase()) || exp.category}
                        </p>
                        {exp.notes && exp.notes.toUpperCase() !== exp.category.toUpperCase() && (
                          <p className="text-[12px] sm:text-[13px] text-gray-600 dark:text-slate-400 mt-0.5 truncate max-w-full">
                            {exp.notes}
                          </p>
                        )}
                        <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 font-medium flex items-center flex-wrap gap-1.5">
                          <span className="truncate max-w-[120px]">{exp.user?.name || "Unknown"}</span>
                          <span className="w-1 h-1 bg-gray-300 dark:bg-slate-600 rounded-full" />
                          <span>{new Date(exp.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()}</span>
                        </p>
                      </div>
                      <div className="flex items-center shrink-0">
                        <p className={`font-bold text-gray-800 dark:text-slate-200 text-[14px] sm:text-[15px] text-right min-w-[70px] sm:min-w-[90px] whitespace-nowrap ${(canEdit(exp) || canDelete(exp)) ? 'pr-3 border-r border-gray-100 dark:border-slate-700' : ''}`}>
                          {formatCurrency(exp.amount, currency)}
                        </p>
                        <div className="flex gap-1.5 sm:gap-2 pl-3">
                          {canEdit(exp) && onEdit && (
                            <button 
                              onClick={() => {
                                onEdit(exp);
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors border border-blue-100 dark:border-blue-500/20"
                              title="Edit expense"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                          )}
                          
                          {canDelete(exp) && onDelete && (
                            <button 
                              onClick={() => onDelete(exp.id)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors border border-red-100 dark:border-red-500/20"
                              title="Delete expense"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
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

function SearchableDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder 
}: { 
  value: string, 
  options: {value: string, label: string}[], 
  onChange: (v: string) => void,
  placeholder: string
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-gray-900 dark:text-white text-left focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 relative flex justify-between items-center h-[42px]"
      >
        <span className="truncate capitalize">{selectedLabel}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-500 dark:text-slate-400 absolute right-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-[110] w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100 dark:border-slate-700 shrink-0">
            <input 
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-accent-500 text-gray-900 dark:text-white"
            />
          </div>
          <div className="overflow-y-auto flex-grow" style={{ scrollbarWidth: 'thin' }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 text-center">No results</div>
            ) : (
              filteredOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 capitalize ${value === opt.value ? 'text-accent-600 dark:text-accent-400 bg-accent-50/50 dark:bg-accent-500/10' : 'text-gray-700 dark:text-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
