"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

import { deleteCredit } from "@/app/dashboard/projects/actions";

export default function CreditHistoryModal({ isOpen, onClose, project, currency, onAddCredit }: any) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useTenantPreferences();

  if (!isOpen) return null;

  const creditsList = project?.credits || [];
  const totalCredits = creditsList.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    setIsSubmitting(true);
    try {
      await onAddCredit({
        projectId: project.id,
        amount: Number(amount),
        paymentMethod,
        notes: note
      });
      setAmount("");
      setNote("");
      onClose(); // Close the modal upon success!
    } catch (error) {
      console.error(error);
      // Optional: You can bubble this error up or show a local toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (creditId: string) => {
    if (!confirm(t('remove_staff_confirm') ? t('remove_staff_confirm') : "Are you sure you want to delete this credit record?")) return;
    setDeletingId(creditId);
    try {
      await deleteCredit(creditId, project.id);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border border-gray-100 overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('credit_history') || "Credit History"}</h2>
            <p className="text-emerald-600 text-xl font-bold mt-1">{formatCurrency(totalCredits, currency)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {/* Add Credit Form */}
          <div className="p-5 border-b border-gray-100 bg-white">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4 border border-gray-200">
              {['CASH', 'GPAY', 'BANK_TRANSFER'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                    paymentMethod === method 
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {method === 'BANK_TRANSFER' ? (t('bank_transfer') || 'Bank Transfer') : method === 'GPAY' ? (t('gpay') || 'Gpay') : (t('cash') || 'Cash')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('amount') || "Amount"}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !amount}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 border border-emerald-200 whitespace-nowrap"
                >
                  {isSubmitting ? (t('adding_credit') || 'Adding...') : (t('add_credit') || 'Add Credit')}
                </button>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('note_optional') || "Note (optional)"}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
              />
            </form>
          </div>

          {/* History List */}
          <div className="p-5 bg-gray-50/50">
            {creditsList.length === 0 ? (
              <div className="p-6 text-center text-gray-500 font-medium">
                {t('no_credit_history') || "No credit history found."}
              </div>
            ) : (
              <div className="space-y-3">
                {creditsList.map((credit: any) => (
                  <div key={credit.id} className={`bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-gray-200 transition-colors shadow-sm ${deletingId === credit.id ? 'opacity-50' : ''}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm">
                          {credit.paymentMethod === 'BANK_TRANSFER' ? (t('bank_transfer') || 'Bank Transfer') : credit.paymentMethod === 'GPAY' ? (t('gpay') || 'Gpay') : (t('cash') || 'Cash')}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{new Date(credit.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      {credit.notes && <p className="text-sm text-gray-600">{credit.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-emerald-600">{formatCurrency(credit.amount, currency)}</p>
                      <button onClick={() => handleDelete(credit.id)} disabled={deletingId === credit.id} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-100">
                        {deletingId === credit.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
