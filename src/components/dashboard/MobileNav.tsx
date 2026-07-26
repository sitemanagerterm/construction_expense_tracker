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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 px-2 transition-colors duration-200">
      <div className="flex items-center justify-evenly h-full max-w-md mx-auto relative">
        {navLinks.map((link, index) => {
          if (link.roles && !link.roles.includes(user?.role)) {
            const hasPermission = user?.role === "STAFF" && link.permission && user?.tenantRole?.permissions?.includes(link.permission);
            if (!hasPermission) {
              return null;
            }
          }
          
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 outline-none relative group ${
                isActive ? "text-primary-900 dark:text-accent" : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? '-translate-y-1' : 'group-active:scale-95'}`}>
                {link.icon}
              </div>
              <span className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>
                {(link as any).translationKey ? t((link as any).translationKey) : link.name}
              </span>
              
              {/* Active Indicator Dot */}
              <div className={`absolute bottom-1 w-1 h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-accent opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
            </Link>
          );
        })}
      </div>
      {/* Bottom Home Indicator Bar spacing */}
      <div className="h-1 w-1/3 bg-slate-300 rounded-full mx-auto mb-2 opacity-50"></div>
    </nav>
  );
}
