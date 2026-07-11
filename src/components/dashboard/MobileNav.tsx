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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navLinks.filter(l => {
          if (l.name === "Audit Logs") return false;
          if (l.roles && !l.roles.includes(user?.role)) return false;
          return true;
        }).slice(0, 5).map((link) => {
          const isActive = link.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
            
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? "text-primary-900 font-bold" : "text-brandtext-secondary hover:text-brandtext"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {link.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {(link as any).translationKey ? t((link as any).translationKey) : link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
