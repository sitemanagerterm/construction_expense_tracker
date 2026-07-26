"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { FaHistory, FaSearch, FaTrash, FaEdit, FaArchive } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

type AuditLog = {
  id: string;
  action: string;
  reason: string;
  oldAmount?: number | null;
  newAmount?: number | null;
  createdAt: Date;
  modifierName: string;
  expense: {
    amount: number;
    category: string;
    date: Date;
    project: { name: string };
  };
};

export default function AuditLogsClient({ initialLogs, allProjects }: { initialLogs: any[], allProjects?: any[] }) {
  const { currency, t } = useTenantPreferences();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("ALL");

  const uniqueProjects = allProjects
    ? Array.from(new Set(allProjects.map(p => p.name)))
    : Array.from(new Set(initialLogs.map(log => log.expense.project.name)));

  const filteredLogs = initialLogs.filter(log => {
    const matchesSearch = log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.modifierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.expense.project.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = filterProject === "ALL" || log.expense.project.name === filterProject;

    return matchesSearch && matchesProject;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <FaHistory className="text-primary-600 dark:text-primary-400" /> {t('audit_logs')}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">{t('audit_logs_desc') || "Review deleted expenses and modification history"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{t('search_logs')}</label>
          <div className="flex items-center gap-3">
            <FaSearch className="text-gray-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder={t('search_reason_or_user') || "Search reason or user..."} 
              className="w-full text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">{t('filter_by_project') || "Filter by Project"}</label>
          <select 
            value={filterProject} 
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full text-sm font-semibold text-gray-900 dark:text-white border-none outline-none bg-transparent cursor-pointer"
          >
            <option value="ALL">{t('all_projects') || "All Projects"}</option>
            {uniqueProjects.map((projectName: any) => (
              <option key={projectName} value={projectName}>{projectName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                <th className="p-4 font-semibold whitespace-nowrap">{t('date_time') || "Date / Time"}</th>
                <th className="p-4 font-semibold whitespace-nowrap">{t('action_header') || "Action"}</th>
                <th className="p-4 font-semibold whitespace-nowrap">{t('original_expense') || "Original Expense"}</th>
                <th className="p-4 font-semibold whitespace-nowrap">Modified By</th>
                <th className="p-4 font-semibold min-w-[200px]">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-slate-400 text-sm">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-sm text-gray-600 dark:text-slate-300 whitespace-nowrap">
                      {format(new Date(log.createdAt), "dd MMM yyyy")}
                      <div className="text-xs text-gray-400 dark:text-slate-500">{format(new Date(log.createdAt), "hh:mm a")}</div>
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      {log.action === "EDITED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                          <FaEdit className="text-amber-500 dark:text-amber-400" /> {t('edited') || "EDITED"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                          <FaTrash className="text-red-500 dark:text-red-400" /> {t('deleted') || "DELETED"}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-gray-900 dark:text-white">{formatCurrency(log.expense.amount, currency)} - {log.expense.category}</div>
                      {log.action === "EDITED" && log.oldAmount != null && log.newAmount != null && (
                        <div className="mt-1 flex items-center gap-2 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 w-fit px-2 py-1 rounded-md">
                          <span className="line-through opacity-70">{formatCurrency(log.oldAmount, currency)}</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          <span>{formatCurrency(log.newAmount, currency)}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">Project: {log.expense.project.name}</div>
                      <div className="text-xs text-gray-400 dark:text-slate-500">Exp Date: {format(new Date(log.expense.date), "dd MMM yyyy")}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-slate-300 whitespace-nowrap">
                      {log.modifierName}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-300 p-2.5 rounded-lg text-xs font-semibold leading-relaxed relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 dark:bg-blue-500"></div>
                        {log.reason}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
