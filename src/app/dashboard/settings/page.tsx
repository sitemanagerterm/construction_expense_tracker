import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClientPage from "./SettingsClientPage";

export const metadata = {
  title: "Settings | MySiteBook",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role === "STAFF") {
    redirect("/dashboard");
  }

  let user = null;

  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        role: true,
        tenant: {
          select: {
            name: true,
            currency: true,
            language: true
          }
        }
      }
    });
  }

  const lang = user?.tenant?.language || "en";
  const { dictionaries } = await import("@/lib/i18n/dictionaries");
  const t = (key: string) => dictionaries[lang]?.[key] || dictionaries["en"][key] || key;

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{t('manage_account_desc') || "Manage your account and preferences."}</p>
        </div>
      </div>
      
      {user ? (
        <SettingsClientPage initialUser={user} />
      ) : (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl">Error loading user profile.</div>
      )}
    </div>
  );
}
