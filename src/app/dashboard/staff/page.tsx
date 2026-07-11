import React from "react";
import { getStaff } from "@/app/actions/staff";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffClientPage from "./StaffClientPage";

export const metadata = {
  title: "Staff & Team | MySiteBook",
};

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role === "STAFF") {
    redirect("/dashboard");
  }

  const { data: staff, staffLimit, activeStaffCount, error } = await getStaff();

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff & Team</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team members and their access.</p>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">Error loading staff: {error}</div>
      ) : (
        <StaffClientPage 
          initialStaff={staff || []} 
          staffLimit={staffLimit || 1}
          activeStaffCount={activeStaffCount || 0}
        />
      )}
    </div>
  );
}
