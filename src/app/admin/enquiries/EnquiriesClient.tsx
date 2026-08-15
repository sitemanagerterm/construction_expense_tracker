"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Check, Trash2, MailOpen, AlertCircle } from "lucide-react";
import { markContactMessageAsRead, deleteContactMessage } from "@/app/actions/admin";

type ContactMessage = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

export default function EnquiriesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [loading, setLoading] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    setLoading(id);
    const res = await markContactMessageAsRead(id);
    if (res.success) {
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: "READ" } : m));
    }
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    setLoading(id);
    const res = await deleteContactMessage(id);
    if (res.success) {
      setMessages(msgs => msgs.filter(m => m.id !== id));
    }
    setLoading(null);
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <MailOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">No Enquiries Yet</h3>
        <p className="text-slate-500 mt-1">When users submit the contact form, their messages will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs uppercase tracking-wider font-bold text-slate-500">
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4 min-w-[300px]">Message Details</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map(msg => (
              <tr key={msg.id} className={`hover:bg-slate-50 transition-colors ${msg.status === 'NEW' ? 'bg-blue-50/30' : ''}`}>
                <td className="p-4 align-top">
                  {msg.status === 'NEW' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      <AlertCircle className="w-3 h-3" /> New
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      Read
                    </span>
                  )}
                </td>
                <td className="p-4 align-top text-sm font-medium text-slate-700 whitespace-nowrap">
                  {format(new Date(msg.createdAt), "MMM d, yyyy")}
                  <div className="text-xs text-slate-400 mt-1">{format(new Date(msg.createdAt), "h:mm a")}</div>
                </td>
                <td className="p-4 align-top">
                  <div className="font-bold text-slate-900">{msg.name}</div>
                  <div className="text-sm text-primary hover:underline cursor-pointer">{msg.email}</div>
                  {msg.phone && <div className="text-sm text-slate-600">{msg.phone}</div>}
                  {msg.company && <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{msg.company}</div>}
                </td>
                <td className="p-4 align-top">
                  {msg.subject && <div className="text-sm font-bold text-slate-800 mb-1">{msg.subject}</div>}
                  <div className="text-sm text-slate-600 whitespace-pre-wrap">{msg.message}</div>
                </td>
                <td className="p-4 align-top text-right space-x-2 whitespace-nowrap">
                  {msg.status === 'NEW' && (
                    <button 
                      onClick={() => handleMarkAsRead(msg.id)}
                      disabled={loading === msg.id}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    disabled={loading === msg.id}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
