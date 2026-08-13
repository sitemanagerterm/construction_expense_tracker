"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Building2, LayoutDashboard, CreditCard, Settings, LogOut, Lock } from "lucide-react";

export const superAdminNavLinks = [
  {
    name: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    name: "Tenants",
    href: "/admin/tenants",
    icon: <Building2 className="w-5 h-5" />
  },
  {
    name: "Subscriptions & Plans",
    href: "/admin/plans",
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    name: "Platform Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />
  }
];

export default function SuperAdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-slate-900 sticky top-0 shrink-0">
      <div className="flex items-center justify-start h-[72px] px-6 border-b border-slate-800 bg-slate-900">
        <Link href="/admin" className="block outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg">
          <Image 
            src="/mysitebook-logo-light.png" 
            alt="MySiteBook" 
            width={300} 
            height={100}
            priority
            className="w-[140px] lg:w-[150px] h-auto object-contain" 
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6">
        <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Super Admin Panel
        </div>
        {superAdminNavLinks.map((link) => {
          const isActive = link.href === "/admin"  
            ? pathname === "/admin" 
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-medium text-sm outline-none ${
                  isActive 
                    ? "bg-slate-800 text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white bg-transparent"
                }`}
              >
              <span className={`${isActive ? 'text-accent' : 'text-slate-500'}`}>
                {link.icon}
              </span>
              <span className="truncate">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm shrink-0 shadow-sm uppercase border border-accent/30">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate capitalize">{user?.name || "Super Admin"}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{(user?.role || "").replace("_", " ")}</span>
            </div>
          </div>
        </div>

        <Link 
          href="/admin/settings#security"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent outline-none mb-1 group"
        >
          <span className="text-slate-500 group-hover:text-white">
            <Lock className="w-5 h-5" />
          </span>
          Change Password
        </Link>

        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent outline-none group"
        >
          <span className="text-slate-500 group-hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
