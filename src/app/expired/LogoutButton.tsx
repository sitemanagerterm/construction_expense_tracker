"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-600 text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
