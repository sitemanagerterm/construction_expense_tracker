"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSiteContext } from "@/components/providers/SiteProvider";

export default function DesktopHeader() {
  const { activeSiteId, setActiveSiteId, activeProjects } = useSiteContext();
  const pathname = usePathname();
  const isDashboardRoot = pathname === "/dashboard" || pathname?.startsWith("/dashboard/projects");

  return (
    <div className="hidden md:flex h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 items-center justify-end px-6 shrink-0 transition-colors duration-200">
      {!isDashboardRoot && (
        <div className="relative flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-accent-500 dark:to-accent-400 shadow-sm shadow-primary-500/20 dark:shadow-accent-500/20 px-4 py-1.5 rounded-full shrink-0" title="Switch Active Site">
          <div className="relative flex h-2 w-2 shrink-0 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-primary-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-primary-900"></span>
          </div>
          <select 
            value={activeSiteId} 
            onChange={(e) => setActiveSiteId(e.target.value)}
            className="text-xs font-bold text-white dark:text-primary-900 uppercase tracking-widest bg-transparent outline-none appearance-none cursor-pointer pr-5 py-0.5 drop-shadow-sm dark:drop-shadow-none"
          >
            <option value="ALL" className="text-gray-900 dark:text-white bg-white dark:bg-slate-900 font-bold uppercase">ALL SITES</option>
            {activeProjects.map(p => (
              <option key={p.id} value={p.id} className="text-gray-900 dark:text-white bg-white dark:bg-slate-900 font-bold uppercase">
                {p.name}
              </option>
            ))}
          </select>
          <svg className="w-3 h-3 text-white dark:text-primary-900 absolute right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      )}
    </div>
  );
}
