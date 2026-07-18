"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./Sidebar";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

export default function MobileNav({ user }: { user: any }) {
  const pathname = usePathname();
  const { t } = useTenantPreferences();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center h-[72px] px-2">
        {navLinks.filter(l => {
          if (l.roles && !l.roles.includes(user?.role)) return false;
          return true;
        }).slice(0, 5).map((link) => {
          const isActive = link.href === "/dashboard" 
            ? pathname === "/dashboard" || pathname.startsWith("/dashboard/projects")
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
            
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex flex-col items-center justify-center flex-1 h-full px-1"
            >
              <div className={`flex flex-col items-center justify-center w-[90%] mx-auto py-2 rounded-2xl transition-all ${
                isActive 
                  ? "bg-slate-100 text-gray-900 font-bold" 
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}>
                <div className={`mb-1 flex items-center justify-center w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {link.icon}
                </div>
                <span className={`text-[10px] leading-tight text-center ${isActive ? "font-bold" : "font-medium"}`}>
                  {(link as any).translationKey ? t((link as any).translationKey) : link.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Bottom Home Indicator Bar spacing */}
      <div className="h-1 w-1/3 bg-slate-300 rounded-full mx-auto mb-2 opacity-50"></div>
    </div>
  );
}
