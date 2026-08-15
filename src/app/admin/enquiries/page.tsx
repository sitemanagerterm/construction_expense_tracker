import React from "react";
import { getContactMessages } from "@/app/actions/admin";
import EnquiriesClient from "./EnquiriesClient";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Enquiries | MySiteBook Admin",
};

export default async function EnquiriesPage() {
  const { messages } = await getContactMessages();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Contact Enquiries
          </h1>
          <p className="text-gray-500 mt-1">Manage messages received from the public Contact form.</p>
        </div>
      </div>

      <EnquiriesClient initialMessages={messages || []} />
    </div>
  );
}
