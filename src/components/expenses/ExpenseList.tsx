"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FaPlus, FaTrash, FaEdit, FaCheckCircle, FaExclamationCircle, FaSync, FaArchive } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import Link from "next/link";
import SmartExpenseForm from "./SmartExpenseForm";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getQueuedExpenses, syncOfflineExpenses, QueuedExpense } from "@/lib/offlineSync";
import { deleteExpense } from "@/app/actions/expenses";
import toast from "react-hot-toast";

type Project = { id: string; name: string };
type Expense = {
  id: string;
  amount: number;
  category: string;
  date: Date;
  notes: string | null;
  project: { id?: string; name: string };
  createdAt: Date;
  user: { id: string; name: string | null; role: string };
  offlineId?: string; // Optional for locally queued items
};

export default function ExpenseList({
  initialExpenses,
  activeProjects,
  currentUser
}: {
  initialExpenses: Expense[];
  activeProjects: Project[];
  currentUser: any;
}) {
  const { currency } = useTenantPreferences();
  const isOnline = useNetworkStatus();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [queuedExpenses, setQueuedExpenses] = useState<QueuedExpense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterProjectId, setFilterProjectId] = useState<string>("ALL");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; expenseId: string | null; reason: string }>({ isOpen: false, expenseId: null, reason: "" });
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  // Sync state with props (important for Server Action revalidation)
  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  // Load offline queue on mount and when network status changes
  useEffect(() => {
    loadQueue();
  }, [isOnline]);

  const loadQueue = async () => {
    const queue = await getQueuedExpenses();
    setQueuedExpenses(queue);
  };

  // Attempt sync when coming online
  useEffect(() => {
    if (isOnline && queuedExpenses.length > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, queuedExpenses.length]);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncOfflineExpenses();
    if (result.success > 0) {
      toast.success(`Synced ${result.success} expenses!`);
      // In a real app we'd want to refetch from the server here to get the real IDs
      // For now, next time the page reloads it will fetch.
    }
    if (result.failed > 0) {
      toast.error(`Failed to sync ${result.failed} expenses.`);
    }
    await loadQueue();
    setIsSyncing(false);
  };

  const handleDeleteClick = (id: string, offlineId?: string) => {
    if (offlineId) {
      toast.error("Cannot delete pending offline expenses yet.");
      return;
    }
    setDeleteModal({ isOpen: true, expenseId: id, reason: "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.expenseId) return;
    if (!deleteModal.reason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }

    const res = await deleteExpense(deleteModal.expenseId, deleteModal.reason);
    if (res.success) {
      toast.success("Expense deleted");
      setExpenses(expenses.filter(e => e.id !== deleteModal.expenseId));
      setDeleteModal({ isOpen: false, expenseId: null, reason: "" });
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  // Combine real expenses and queued expenses for display
  const allExpenses = [
    ...queuedExpenses.map(q => ({
      id: q.offlineId,
      amount: q.amount,
      category: q.category,
      date: new Date(q.date),
      notes: q.notes || null,
      createdAt: new Date(),
      project: { id: q.projectId, name: activeProjects.find(p => p.id === q.projectId)?.name || "Unknown" },
      user: { id: currentUser.id, name: "You", role: currentUser.role || "Pending" },
      offlineId: q.offlineId
    })),
    ...expenses
  ];

  const filteredExpenses = filterProjectId === "ALL" 
    ? allExpenses 
    : allExpenses.filter(e => e.project.id === filterProjectId || (!e.project.id && activeProjects.find(p => p.id === filterProjectId)?.name === e.project.name));

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Expense Tracker</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Log and manage construction site expenses
            {!isOnline && (
              <span className="text-warning font-semibold ml-2 flex items-center inline-flex gap-1">
                <FaExclamationCircle /> You are offline. Data is saved locally.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {queuedExpenses.length > 0 && isOnline && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FaSync className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : `Sync (${queuedExpenses.length})`}
            </button>
          )}
          {activeProjects.length > 0 && (
            <button 
              onClick={() => { setExpenseToEdit(null); setIsFormOpen(true); }}
              className="flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 hover:bg-primary-800 transition-all hover:-translate-y-0.5"
            >
              <FaPlus /> Log Expense
            </button>
          )}
        </div>
      </div>

      {/* Filter and Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <label className="text-xs font-semibold text-gray-500 mb-1">Filter by Project</label>
          <select 
            value={filterProjectId} 
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="w-full text-sm font-semibold text-gray-900 border-none bg-gray-50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="ALL">All Projects</option>
            {activeProjects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
             <p className="text-xs font-semibold text-gray-500 mb-1">Filtered Total</p>
             <h3 className="text-xl font-bold text-gray-900 break-words">{formatCurrency(totalFilteredAmount, currency)}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
             <p className="text-xs font-semibold text-gray-500 mb-1">Filtered Count</p>
             <h3 className="text-xl font-bold text-gray-900 break-words">{filteredExpenses.length} Expense(s)</h3>
          </div>
        </div>
      </div>

      {/* Data Table / List */}
      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-16 border border-gray-100 shadow-sm w-full mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-5 border border-gray-200">
            <FaPlus className="text-xl" />
          </div>
          
          {activeProjects.length === 0 ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto text-center">You need to create a project first before you can log any expenses.</p>
              <Link 
                href="/dashboard/projects"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white font-bold text-sm rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
              >
                <FaPlus /> Go to Projects
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No expenses logged yet</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto text-center">Click the button above to log your first expense.</p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status/Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {expense.project.name}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate">
                      {expense.notes || "-"}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-900 text-right">
                      <span className="font-bold text-gray-900 text-sm">{formatCurrency(expense.amount, currency)}</span>
                    </td>
                    <td className="p-4 text-sm">
                      {expense.offlineId ? (
                        <span className="inline-flex items-center gap-1 text-warning font-medium">
                          <FaSync className="animate-spin text-xs" /> Pending Sync
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-success font-medium">
                            <FaCheckCircle className="text-xs" /> Saved
                          </span>
                          {(() => {
                            let canModify = false;
                            if (currentUser.role === "OWNER" || currentUser.role === "SUPER_ADMIN") {
                              canModify = true;
                            } else {
                              const today = new Date();
                              const createdDate = new Date(expense.createdAt);
                              const isToday = today.getFullYear() === createdDate.getFullYear() &&
                                              today.getMonth() === createdDate.getMonth() &&
                                              today.getDate() === createdDate.getDate();
                              if (expense.user.id === currentUser.id && isToday) {
                                canModify = true;
                              }
                            }
                            if (!canModify) return null;
                            return (
                              <>
                                <button 
                                  onClick={() => { setExpenseToEdit(expense); setIsFormOpen(true); }}
                                  className="text-gray-400 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-50"
                                  title="Edit expense"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(expense.id, expense.offlineId)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                  title="Delete expense"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <SmartExpenseForm 
          projects={activeProjects}
          expenseToEdit={expenseToEdit}
          onClose={() => { setIsFormOpen(false); setExpenseToEdit(null); }} 
          onSuccess={() => {
            setIsFormOpen(false);
            setExpenseToEdit(null);
            loadQueue();
            // Optional: Hard refresh or use server actions to refetch
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center items-center p-4 pb-[72px] sm:pb-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteModal({ isOpen: false, expenseId: null, reason: "" })}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Expense</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this expense? This action will be logged in the audit trail.</p>
              
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Deleting *</label>
              <textarea
                value={deleteModal.reason}
                onChange={(e) => setDeleteModal({ ...deleteModal, reason: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none h-24"
                placeholder="e.g. Entered wrong amount, duplicate entry..."
              ></textarea>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, expenseId: null, reason: "" })}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={!deleteModal.reason.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
