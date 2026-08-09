"use client";

import React from "react";
import { useSiteContext } from "@/components/providers/SiteProvider";

export default function DesktopHeader() {
  const { activeSiteId, activeProjects } = useSiteContext();

  return (
    <div className="hidden md:flex h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 items-center justify-end px-6 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-accent-500 dark:to-accent-400 shadow-sm shadow-primary-500/20 dark:shadow-accent-500/20 px-4 py-2 rounded-full shrink-0" title="Active Site">
        <div className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-primary-900 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-primary-900"></span>
        </div>
        <span className="text-xs font-bold text-white dark:text-primary-900 uppercase tracking-widest truncate max-w-[200px] drop-shadow-sm dark:drop-shadow-none">
          {activeSiteId === "ALL" ? "All Sites" : activeProjects.find(p => p.id === activeSiteId)?.name || "All Sites"}
        </span>
      </div>
    </div>
  );
}
