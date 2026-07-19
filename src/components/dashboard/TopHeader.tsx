"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { updateLanguage } from "@/app/actions/settings";

export default function TopHeader({ user }: { user: any }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const { language, t } = useTenantPreferences();

  const handleLanguageChange = async (lang: string) => {
    if (language === lang || isChangingLanguage) return;
    setIsChangingLanguage(true);
    await updateLanguage(lang);
    setIsChangingLanguage(false);
  };

  const currentLang = language.toUpperCase() === "EN" ? "EN" : language.toUpperCase() === "TA" ? "த" : "हि";

  return (
    <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-40">
      <Link href="/dashboard" className="block outline-none">
        <Image 
          src="/mysitebook-logo-dark.png" 
          alt="MySiteBook" 
          width={300} 
          height={100} 
          className="w-[160px] lg:w-[180px] h-auto object-contain drop-shadow-sm -ml-1" 
        />
      </Link>
      
      <div className="flex items-center gap-3">
        {/* Mobile Language Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
          <button onClick={() => handleLanguageChange('en')} disabled={isChangingLanguage} className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${language === 'en' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white'} ${isChangingLanguage ? 'opacity-50' : ''}`}>EN</button>
          <button onClick={() => handleLanguageChange('ta')} disabled={isChangingLanguage} className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${language === 'ta' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white'} ${isChangingLanguage ? 'opacity-50' : ''}`}>த</button>
          <button onClick={() => handleLanguageChange('hi')} disabled={isChangingLanguage} className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${language === 'hi' ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white'} ${isChangingLanguage ? 'opacity-50' : ''}`}>हि</button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0 uppercase text-sm border border-accent/30 hover:bg-accent/30 transition-colors focus:outline-none"
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </button>
          
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-900 truncate capitalize">{user?.name || "User"}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{user?.role || "OWNER"}</p>
                </div>
                {user?.role !== "STAFF" && (
                  <Link 
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-50"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {t('settings')}
                  </Link>
                )}
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  {t('sign_out')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
