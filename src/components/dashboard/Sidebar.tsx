"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BadgeIndianRupee, Home, Users, History, FileText, ShieldAlert, Settings } from "lucide-react";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { updateLanguage } from "@/app/actions/settings";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" />, translationKey: "dashboard" },
  { name: "Staff & Team", href: "/dashboard/staff", icon: <Users className="w-5 h-5" />, roles: ["SUPER_ADMIN", "OWNER"], translationKey: "staff" },
  { name: "Audit Logs", href: "/dashboard/audit-logs", icon: <History className="w-5 h-5" />, roles: ["SUPER_ADMIN", "OWNER"], translationKey: "audit_logs" },
  { name: "Documents", href: "/dashboard/documents", icon: <FileText className="w-5 h-5" />, translationKey: "documents" },
  { name: "Super Admin", href: "/dashboard/super-admin", icon: <ShieldAlert className="w-5 h-5" />, roles: ["SUPER_ADMIN"], translationKey: "super_admin" },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, roles: ["SUPER_ADMIN", "OWNER"], translationKey: "settings" }
];

export default function Sidebar({ user, tenantName }: { user: any, tenantName?: string }) {
  const pathname = usePathname();
  const { language, t } = useTenantPreferences();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const handleLanguageChange = async (lang: string) => {
    if (language === lang || isChangingLanguage) return;
    setIsChangingLanguage(true);
    await updateLanguage(lang);
    setIsChangingLanguage(false);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 shrink-0 transition-colors duration-200">
      <div className="pt-3 px-7 pb-2">
        <Link href="/dashboard" className="block outline-none">
          <Image 
            src="/mysitebook-logo-dark.png" 
            alt="MySiteBook" 
            width={300} 
            height={100}
            priority
            className="w-[150px] lg:w-[170px] h-auto object-contain drop-shadow-sm dark:hidden" 
          />
          <Image 
            src="/mysitebook-logo-light.png" 
            alt="MySiteBook" 
            width={300} 
            height={100}
            priority
            className="w-[150px] lg:w-[170px] h-auto object-contain drop-shadow-sm hidden dark:block" 
          />
        </Link>
        <div className="mt-4 px-1 pb-2 border-b border-gray-100 dark:border-slate-800 mb-2">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Company</p>
          <p className="text-[15px] font-black text-gray-800 dark:text-white truncate capitalize">{tenantName}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navLinks.map((link) => {
          if (link.roles && !link.roles.includes(user?.role)) {
            return null;
          }

          const isActive = link.href === "/dashboard"  
            ? pathname === "/dashboard" || pathname.startsWith("/dashboard/projects")
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
                key={link.name}
                href={link.href}
                className={`group/navlink relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-medium text-sm outline-none ${
                  isActive 
                    ? "bg-primary-900 dark:bg-accent text-white dark:text-primary-900 shadow-md shadow-primary-900/20 dark:shadow-accent/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-900 dark:hover:text-white bg-transparent"
                }`}
              >
              <span className={`${isActive ? 'text-accent dark:text-primary-900' : 'text-slate-400 dark:text-slate-500'}`}>
                {link.icon}
              </span>
              <span className="truncate">
                {(link as any).translationKey ? t((link as any).translationKey) : link.name}
              </span>
              
              {/* Premium Custom Tooltip */}
              <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover/navlink:opacity-100 group-hover/navlink:visible transition-all whitespace-nowrap z-[100] shadow-xl pointer-events-none border border-slate-700/50 flex items-center">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/50"></div>
                <span className="relative z-10">{(link as any).translationKey ? t((link as any).translationKey) : link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        
        {/* Desktop Language Toggle */}
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1 border border-gray-200 dark:border-slate-700 w-full justify-between">
          <button onClick={() => handleLanguageChange('en')} disabled={isChangingLanguage} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${language === 'en' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>EN</button>
          <button onClick={() => handleLanguageChange('ta')} disabled={isChangingLanguage} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${language === 'ta' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>தமிழ்</button>
          <button onClick={() => handleLanguageChange('hi')} disabled={isChangingLanguage} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${language === 'hi' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'} ${isChangingLanguage ? 'opacity-50' : ''}`}>हिंदी</button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-accent text-primary-900 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm uppercase border border-accent/30">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate capitalize">{user?.name || "User"}</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{user?.role || "OWNER"}</span>
            </div>
          </div>
        </div>

        {/* Desktop Theme + Sign Out row */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-transparent outline-none group"
          >
            <span className="text-gray-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </span>
            {t('sign_out')}
          </button>
        </div>
      </div>
    </aside>
  );
}
