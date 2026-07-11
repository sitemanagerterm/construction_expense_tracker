"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteStaff, toggleStaffStatus } from "@/app/actions/staff";
import AddStaffModal from "@/components/staff/AddStaffModal";
import toast from "react-hot-toast";

type Staff = {
  id: string;
  name: string | null;
  mobileNumber: string | null;
  pin: string | null;
  isBlocked: boolean;
  createdAt: Date;
};

export default function StaffClientPage({ 
  initialStaff,
  staffLimit,
  activeStaffCount
}: { 
  initialStaff: Staff[],
  staffLimit: number,
  activeStaffCount: number
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; actionText: string; actionStyle: string; hideCancel?: boolean; onConfirm: () => void } | null>(null);
  const router = useRouter();

  const handleConfirmAction = (title: string, message: string, actionText: string, actionStyle: string, action: () => void, hideCancel?: boolean) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      actionText,
      actionStyle,
      hideCancel,
      onConfirm: () => {
        setConfirmModal(null);
        action();
      }
    });
  };

  const handleDelete = async (id: string) => {
    
    setIsDeleting(id);
    const res = await deleteStaff(id);
    if (res.success) {
      toast.success(res.message || "Staff member removed");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to remove staff");
    }
    setIsDeleting(null);
  };

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    setIsDeleting(id);
    const res = await toggleStaffStatus(id, isBlocked);
    if (res.success) {
      toast.success(res.message || "Status updated");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsDeleting(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={() => {
              if (activeStaffCount >= staffLimit) {
                handleConfirmAction(
                  "Staff Limit Reached",
                  `You have reached your limit of ${staffLimit} active staff members. Please upgrade your plan or block an existing staff member to add more.`,
                  "Understood",
                  "bg-primary-600 hover:bg-primary-700",
                  () => {},
                  true // hide cancel button
                );
                return;
              }
              setEditData(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all bg-primary-900 text-white shadow-primary-900/20 hover:bg-primary-800 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Staff
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {initialStaff.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p className="text-lg font-medium text-gray-900">No staff members yet</p>
            <p className="mt-1">Add staff to allow them to log expenses from the site.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/50 text-gray-700 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Mobile Number</th>
                  <th className="px-6 py-4">Login PIN</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{staff.name}</td>
                    <td className="px-6 py-4">{staff.mobileNumber}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 tracking-wider font-semibold">
                        {staff.pin || "Not set"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(staff.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => {
                          setEditData(staff);
                          setIsModalOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {staff.isBlocked ? (
                        <button 
                          onClick={() => handleToggleBlock(staff.id, false)}
                          disabled={isDeleting === staff.id}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50 transition-colors"
                        >
                          {isDeleting === staff.id ? "Updating..." : "Unblock"}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleBlock(staff.id, true)}
                          disabled={isDeleting === staff.id}
                          className="text-amber-600 hover:text-amber-800 font-medium disabled:opacity-50 transition-colors"
                        >
                          {isDeleting === staff.id ? "Updating..." : "Block"}
                        </button>
                      )}
                      <button 
                        onClick={() => handleConfirmAction(
                          "Remove Staff Member",
                          "Are you sure you want to remove this staff member? If they have logged expenses, they will be blocked instead to preserve financial records.",
                          "Remove",
                          "bg-red-500 hover:bg-red-600",
                          () => handleDelete(staff.id)
                        )}
                        disabled={isDeleting === staff.id}
                        className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                      >
                        {isDeleting === staff.id ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {confirmModal.message}
              </p>
              <div className="flex gap-3 justify-end">
                {!confirmModal.hideCancel && (
                  <button 
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2 rounded-xl font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-xl font-bold text-white shadow-sm transition-colors ${confirmModal.actionStyle}`}
                >
                  {confirmModal.actionText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => router.refresh()} 
        editData={editData}
      />
    </div>
  );
}
