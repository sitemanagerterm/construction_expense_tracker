import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaFileAlt } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Documents - MySiteBook",
};

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: session?.user?.tenantId as string } });
  const lang = tenant?.language || "en";
  const { dictionaries } = await import("@/lib/i18n/dictionaries");
  const t = (key: string) => dictionaries[lang]?.[key] || dictionaries["en"][key] || key;

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 pb-20">
        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-full mb-6">
          <FaFileAlt className="text-5xl text-gray-400 dark:text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('coming_soon')}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-base max-w-md leading-relaxed">
          {t('documents_coming_soon_desc')}
        </p>
      </div>
    </div>
  );
}
