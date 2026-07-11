"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BadgeIndianRupee } from "lucide-react";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

export const navLinks = [
  {
    name: "Dashboard",
    translationKey: "dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
    ),
    roles: ["OWNER", "STAFF"]
  },
  {
    name: "Projects & Sites",
    translationKey: "projects",
    href: "/dashboard/projects",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    ),
    roles: ["OWNER", "STAFF"]
  },
  {
    name: "Expense Tracking",
    translationKey: "expenses",
    href: "/dashboard/expenses",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 9.99984H15.5M8.5 6.5H15.5M14 18.0002L8.5 13.5002L10 13.5C14.4447 13.5 14.4447 6.5 10 6.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    roles: ["OWNER", "STAFF"]
  },
  {
    name: "Staff & Team",
    translationKey: "staff",
    href: "/dashboard/staff",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
    ),
    roles: ["OWNER"]
  },
  {
    name: "Audit Logs",
    translationKey: "audit_logs",
    href: "/dashboard/audit-logs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    roles: ["OWNER"]
  },
  {
    name: "Settings",
    translationKey: "settings",
    href: "/dashboard/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    ),
    roles: ["OWNER"]
  },
  {
    name: "Super Admin Panel",
    translationKey: "admin", // fallback if not found
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    ),
    roles: ["SUPER_ADMIN"]
  }
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { t } = useTenantPreferences();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white sticky top-0 shrink-0">
      <div className="pt-3 px-7 pb-2">
        <Link href="/dashboard" className="block outline-none">
          <Image 
            src="/mysitebook-logo-dark.png" 
            alt="MySiteBook" 
            width={300} 
            height={100}
            priority
            className="w-[150px] lg:w-[170px] h-auto object-contain drop-shadow-sm" 
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navLinks.map((link) => {
          if (link.roles && !link.roles.includes(user?.role)) {
            return null;
          }

          const isActive = link.href === "/dashboard"  
            ? pathname === "/dashboard" 
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
                key={link.name}
                href={link.href}
                className={`group/navlink relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-medium text-sm outline-none ${
                  isActive 
                    ? "bg-primary-900 text-white shadow-md shadow-primary-900/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary-900 bg-transparent"
                }`}
              >
              <span className={`${isActive ? 'text-accent' : 'text-slate-400'}`}>
                {link.icon}
              </span>
              <span className="truncate">
                {t(link.translationKey)}
              </span>
              
              {/* Premium Custom Tooltip */}
              <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover/navlink:opacity-100 group-hover/navlink:visible transition-all whitespace-nowrap z-[100] shadow-xl pointer-events-none border border-slate-700/50 flex items-center">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/50"></div>
                <span className="relative z-10">{t(link.translationKey)}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-accent text-primary-900 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-brandtext truncate capitalize">{user?.name || "User"}</span>
              <span className="text-xs font-semibold text-brandtext-secondary uppercase tracking-wider">{user?.role || "OWNER"}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 mt-2 rounded-xl transition-all font-medium text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent outline-none group"
        >
          <span className="text-gray-400 group-hover:text-red-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </span>
          {t('sign_out')}
        </button>
      </div>
    </aside>
  );
}
