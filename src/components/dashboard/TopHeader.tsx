"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { updateLanguage } from "@/app/actions/settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSiteContext } from "@/components/providers/SiteProvider";

export default function TopHeader({ user, tenantName }: { user: any, tenantName?: string }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const { language, t } = useTenantPreferences();
  const { activeSiteId, setActiveSiteId, activeProjects } = useSiteContext();
  const pathname = usePathname();
  const isDashboardRoot = pathname === "/dashboard" || pathname?.startsWith("/dashboard/projects");

  const handleLanguageChange = async (lang: string) => {
    if (language === lang || isChangingLanguage) return;
    setIsChangingLanguage(true);
    await updateLanguage(lang);
    setIsChangingLanguage(false);
  };

  return (
    <header className="md:hidden flex flex-col bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shrink-0 sticky top-0 z-40 transition-colors duration-200">
      {/* Row 1: Logo and Tools */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 w-full gap-2">
        <Link href="/dashboard" className="block outline-none shrink-0 w-fit">
          <Image 
            src="/mysitebook-logo-dark.png" 
            alt="MySiteBook" 
            width={300} 
            height={100} 
            className="w-[120px] sm:w-[130px] h-auto object-contain drop-shadow-sm -ml-1 dark:hidden" 
          />
          <Image 
            src="/mysitebook-logo-light.png" 
            alt="MySiteBook" 
            width={300} 
            height={100} 
            className="w-[120px] sm:w-[130px] h-auto object-contain drop-shadow-sm -ml-1 hidden dark:block" 
          />
        </Link>
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-0.5 border border-gray-200 dark:border-slate-700 shrink-0">
            <button onClick={() => handleLanguageChange('en')} disabled={isChangingLanguage} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-colors ${language === 'en' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>EN</button>
            <button onClick={() => handleLanguageChange('ta')} disabled={isChangingLanguage} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-colors ${language === 'ta' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>த</button>
            <button onClick={() => handleLanguageChange('hi')} disabled={isChangingLanguage} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-colors ${language === 'hi' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>हि</button>
          </div>

          <ThemeToggle />
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-full bg-accent/20 dark:bg-accent/10 text-accent font-bold flex items-center justify-center shrink-0 uppercase text-sm border border-accent/30 hover:bg-accent/30 dark:hover:bg-accent/20 transition-colors focus:outline-none"
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </button>
            
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-slate-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate capitalize">{user?.name || "User"}</p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{user?.role || "OWNER"}</p>
                  </div>
                  
                  {user?.role !== "STAFF" && (
                    <Link 
                      href="/dashboard/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border-b border-gray-50 dark:border-slate-700"
                    >
                      <svg className="w-4 h-4 text-gray-400 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {t('settings')}
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    {t('sign_out')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Row 2: Company Name and Site Pill */}
      <div className="flex items-center justify-between px-4 pb-3 w-full gap-2 mt-1">
        <span className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-widest truncate">
          {tenantName}
        </span>
        
        {!isDashboardRoot && (
          <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-accent-400 to-accent-500 shadow-sm px-2.5 py-1 rounded-full shrink-0" title="Switch Active Site">
             <div className="relative flex h-2 w-2 shrink-0">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
             </div>
             <select 
                value={activeSiteId} 
                onChange={(e) => setActiveSiteId(e.target.value)}
                className="text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-transparent outline-none appearance-none cursor-pointer pr-4 ml-0.5 drop-shadow-sm max-w-[140px] truncate"
              >
                <option value="ALL" className="text-gray-900 bg-white font-bold uppercase">ALL SITES</option>
                {activeProjects.map(p => (
                  <option key={p.id} value={p.id} className="text-gray-900 bg-white font-bold uppercase">
                    {p.name}
                  </option>
                ))}
              </select>
              <svg className="w-3 h-3 text-slate-900 absolute right-1.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        )}
      </div>
    </header>
  );
}
