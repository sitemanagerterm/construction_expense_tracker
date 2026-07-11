"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { superAdminNavLinks } from "./SuperAdminSidebar";

export default function SuperAdminMobileNav({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.2)] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {superAdminNavLinks.slice(0, 5).map((link) => {
          const isActive = link.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
            
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? "text-blue-400 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {link.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
