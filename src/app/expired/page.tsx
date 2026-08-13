import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AlertCircle, Phone, Mail, ChevronDown } from "lucide-react";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

export default async function ExpiredPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.tenantId) {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId }
  });

  if (tenant?.subscriptionExpiry && new Date(tenant.subscriptionExpiry) >= new Date()) {
    redirect("/dashboard"); // Redirect back if they renewed
  }

  const settings = await prisma.platformSettings.findFirst();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="mb-10 sm:mb-12">
            <Image
              src="/mysitebook-logo-dark.png"
              alt="MySiteBook"
              width={400}
              height={100}
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain"
              priority
            />
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mb-8 ring-8 ring-red-50/50">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Subscription Expired
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Your organization's access to MySiteBook has been temporarily suspended because your subscription period has ended.
          </p>

          {/* Scroll Indicator */}
          <div className="mt-12 sm:mt-16 animate-bounce text-slate-400 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-widest mb-2">Scroll for details</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>

        {/* Action Section */}
        <div className="border-t border-slate-100 pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4">How to Restore Access</h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please contact the platform administrator to process your renewal. Access will be restored immediately upon payment confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
            {settings?.supportPhone && (
              <a href={`tel:${settings.supportPhone}`} className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 break-all">{settings.supportPhone}</p>
                </div>
              </a>
            )}

            {settings?.supportEmail && (
              <a href={`mailto:${settings.supportEmail}`} className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Support</p>
                  <p className="text-lg sm:text-xl font-black text-slate-900 break-all">{settings.supportEmail}</p>
                </div>
              </a>
            )}
          </div>

          {!settings?.supportPhone && !settings?.supportEmail && (
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center max-w-3xl mx-auto mb-10">
              <p className="text-base sm:text-lg text-slate-600 font-medium">Please contact your administrator directly.</p>
            </div>
          )}

          {settings?.offlinePaymentInstructions && (
            <div className="bg-amber-50/80 border border-amber-200/60 p-8 sm:p-12 rounded-[2rem] max-w-3xl mx-auto mb-12">
              <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-widest mb-6 flex items-center justify-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                Payment Instructions
              </h3>
              <p className="text-base sm:text-lg text-amber-900/80 whitespace-pre-line leading-relaxed font-medium text-center">
                {settings.offlinePaymentInstructions}
              </p>
            </div>
          )}

          <div className="flex justify-center pb-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
