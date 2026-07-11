import React from "react";
import SuperLoginClient from "./SuperLoginClient";
import SuperLoginLeftPanel from "./SuperLoginLeftPanel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Super Admin Login - MySiteBook",
  description: "Secure login for platform super administrators.",
};

export default async function SuperLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    if (session.user.role === "SUPER_ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel: Branding & Social Proof (Hidden on small screens) */}
      <SuperLoginLeftPanel />

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo with subtle background */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 py-10 bg-slate-900 relative overflow-hidden rounded-b-[2rem] shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="inline-flex items-center relative z-10 rounded-lg p-1">
              <img src="/mysitebook-logo-light.png" alt="MySiteBook" width={300} height={100} className="w-[130px] sm:w-[160px] h-auto object-contain" />
            </div>
            <span className="relative z-10 mt-2 text-accent font-bold tracking-widest uppercase text-xs border border-accent/30 px-2 py-0.5 rounded">Admin Portal</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Super Admin Login</h2>
            <p className="text-gray-500 mt-1.5 text-sm lg:text-base">Restricted access for platform administrators only.</p>
          </div>

          <SuperLoginClient />
          
        </div>
      </div>
    </div>
  );
}
