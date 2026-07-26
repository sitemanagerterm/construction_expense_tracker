"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";

import { deleteCredit } from "@/app/dashboard/projects/actions";

interface CreditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  currency: string;
  isCompleted?: boolean;
  onAddCredit: (data: any) => Promise<void>;
  onEditCredit?: (data: any) => Promise<void>;
  canAddCredit?: boolean;
  canEditCredit?: boolean;
  canDeleteCredit?: boolean;
}

export default function CreditHistoryModal({ isOpen, onClose, project, currency, isCompleted, onAddCredit, onEditCredit, canAddCredit = true, canEditCredit = true, canDeleteCredit = true }: CreditHistoryModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditToEdit, setCreditToEdit] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creditToDelete, setCreditToDelete] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [editReason, setEditReason] = useState("");
  const { t } = useTenantPreferences();

  if (!isOpen) return null;

  const creditsList = project?.credits || [];
  const totalCredits = creditsList.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    if (creditToEdit && !editReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (creditToEdit && onEditCredit) {
        await onEditCredit({
          creditId: creditToEdit.id,
          projectId: project.id,
          amount: Number(amount),
          paymentMethod,
          notes: note,
          reason: editReason.trim()
        });
        setCreditToEdit(null);
        setEditReason("");
      } else {
        await onAddCredit({
          projectId: project.id,
          amount: Number(amount),
          paymentMethod,
          notes: note
        });
      }
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

  const confirmDelete = async () => {
    if (!creditToDelete || !deleteReason.trim()) return;
    setDeletingId(creditToDelete);
    try {
      await deleteCredit(creditToDelete, project.id, deleteReason.trim());
      setCreditToDelete(null);
      setDeleteReason("");
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-gray-900/60 dark:bg-slate-900 sm:dark:bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:max-w-lg rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-0 sm:border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start bg-gray-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-200/80 dark:bg-slate-700/80 dark:text-slate-300 px-2 py-0.5 rounded-full line-clamp-1 max-w-[200px]">{project?.name || "Project"}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('credit_history') || "Credit History"}</h2>
            <p className="text-emerald-600 dark:text-emerald-400 text-xl font-bold mt-1">{formatCurrency(totalCredits, currency)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {/* Add/Edit Credit Form */}
          {!isCompleted && (canAddCredit || creditToEdit) && (
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-4 border border-gray-200 dark:border-slate-700">
              {['CASH', 'GPAY', 'BANK_TRANSFER'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                    paymentMethod === method 
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600' 
                      : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
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
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-accent-500 focus:ring-1 focus:ring-primary-500 dark:focus:ring-accent-500 transition-shadow"
                    required
                  />
                </div>
                {creditToEdit && (
                  <button 
                    type="button" 
                    onClick={() => { setCreditToEdit(null); setAmount(""); setNote(""); setPaymentMethod("CASH"); setEditReason(""); }}
                    className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting || !amount || (creditToEdit && !editReason.trim())}
                  className="bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2 border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap"
                >
                  {isSubmitting ? (creditToEdit ? 'Saving...' : (t('adding_credit') || 'Adding...')) : (creditToEdit ? 'Save Changes' : (t('add_credit') || 'Add Credit'))}
                </button>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('note_optional') || "Note (optional)"}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-accent-500 focus:ring-1 focus:ring-primary-500 dark:focus:ring-accent-500 transition-shadow"
              />
              {creditToEdit && (
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder={t('reason_for_edit') || "Reason for edit (required)"}
                  className="w-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:focus:ring-red-500 transition-shadow"
                  required
                />
              )}
            </form>
          </div>
          )}

          {/* History List */}
          <div className="p-5 bg-gray-50/50 dark:bg-slate-900">
            {creditsList.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-slate-400 font-medium">
                {t('no_credit_history') || "No credit history found."}
              </div>
            ) : (
              <div className="space-y-3">
                {creditsList.map((credit: any) => (
                  <div key={credit.id} className={`bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex justify-between items-center group hover:border-gray-200 dark:hover:border-slate-600 transition-colors shadow-sm ${deletingId === credit.id ? 'opacity-50' : ''}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {credit.paymentMethod === 'BANK_TRANSFER' ? (t('bank_transfer') || 'Bank Transfer') : credit.paymentMethod === 'GPAY' ? (t('gpay') || 'Gpay') : (t('cash') || 'Cash')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{new Date(credit.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      {credit.notes && <p className="text-sm text-gray-600 dark:text-slate-400">{credit.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(credit.amount, currency)}</p>
                      
                      {!isCompleted && canEditCredit && (
                        <button 
                          onClick={() => {
                            setCreditToEdit(credit);
                            setAmount(credit.amount.toString());
                            setNote(credit.notes || "");
                            setPaymentMethod(credit.paymentMethod);
                            setEditReason("");
                          }} 
                          className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-blue-100 dark:border-blue-500/20"
                          title="Edit credit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                      )}

                      {!isCompleted && canDeleteCredit && (
                      <button onClick={() => setCreditToDelete(credit.id)} disabled={deletingId === credit.id} className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-100 dark:border-red-500/20">
                        {deletingId === credit.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        )}
                      </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Delete Credit Confirmation Modal */}
    {creditToDelete && (
      <div className="fixed inset-0 z-[110] flex flex-col justify-end sm:justify-center items-center bg-white sm:bg-slate-900/40 dark:bg-slate-900 sm:dark:bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in" onClick={() => setCreditToDelete(null)}>
        <div className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 sm:border w-full h-full sm:h-auto sm:max-w-sm rounded-none sm:rounded-2xl shadow-none sm:shadow-xl overflow-hidden flex flex-col sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{(t('delete_credit') === 'delete_credit' ? 'Delete Credit' : t('delete_credit')) || "Delete Credit"}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{(t('delete_credit_confirm') === 'delete_credit_confirm' ? 'Please provide a reason for deleting this credit record. It will be logged in the audit trail.' : t('delete_credit_confirm')) || "Please provide a reason for deleting this credit record. It will be logged in the audit trail."}</p>
            
            <div className="mb-6 text-left">
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">{(t('reason_for_deletion') === 'reason_for_deletion' ? 'Reason for Deletion' : t('reason_for_deletion')) || "Reason for Deletion"}</label>
              <textarea 
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full py-2.5 px-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 font-medium text-gray-900 dark:text-white resize-none h-24"
                placeholder="Why are you deleting this credit?"
                required
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCreditToDelete(null)} className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">{t('cancel') || "Cancel"}</button>
              <button onClick={confirmDelete} disabled={deletingId === creditToDelete || !deleteReason.trim()} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {deletingId === creditToDelete ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
                ) : (
                  (t('delete') || "Delete")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
