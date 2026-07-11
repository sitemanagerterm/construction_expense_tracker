"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { FaHistory, FaSearch, FaTrash } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

type AuditLog = {
  id: string;
  action: string;
  reason: string;
  createdAt: Date;
  modifierName: string;
  expense: {
    amount: number;
    category: string;
    date: Date;
    project: { name: string };
  };
};

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const { currency } = useTenantPreferences();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("ALL");

  const uniqueProjects = Array.from(new Set(initialLogs.map(log => log.expense.project.name)));

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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FaHistory className="text-primary-600" /> Audit Logs
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Review deleted expenses and modification history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 mb-1">Search Logs</label>
          <div className="flex items-center gap-3">
            <FaSearch className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reason or user..." 
              className="w-full text-sm font-semibold text-gray-900 border-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 mb-1">Filter by Project</label>
          <select 
            value={filterProject} 
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full text-sm font-semibold text-gray-900 border-none outline-none bg-transparent cursor-pointer"
          >
            <option value="ALL">All Projects</option>
            {uniqueProjects.map((projectName: any) => (
              <option key={projectName} value={projectName}>{projectName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold whitespace-nowrap">Date / Time</th>
                <th className="p-4 font-semibold whitespace-nowrap">Action</th>
                <th className="p-4 font-semibold whitespace-nowrap">Original Expense</th>
                <th className="p-4 font-semibold whitespace-nowrap">Modified By</th>
                <th className="p-4 font-semibold min-w-[200px]">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      {format(new Date(log.createdAt), "dd MMM yyyy")}
                      <div className="text-xs text-gray-400">{format(new Date(log.createdAt), "hh:mm a")}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600">
                        <FaTrash className="text-[10px]" /> {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-gray-900">{formatCurrency(log.expense.amount, currency)} - {log.expense.category}</div>
                      <div className="text-xs text-gray-500">Project: {log.expense.project.name}</div>
                      <div className="text-xs text-gray-400">Exp Date: {format(new Date(log.expense.date), "dd MMM yyyy")}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {log.modifierName}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {log.reason}
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
