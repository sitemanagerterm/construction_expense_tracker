import React from "react";
import SettingsClient from "./SettingsClient";
import { getPlatformSettings } from "@/app/actions/admin";

export default async function SettingsPage() {
  const { settings } = await getPlatformSettings();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Manage global platform configurations and contact details.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <SettingsClient initialSettings={settings || {}} />
      </div>
    </div>
  );
}
