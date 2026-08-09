"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteStaff, toggleStaffStatus } from "@/app/actions/staff";
import AddStaffModal from "@/components/staff/AddStaffModal";
import toast from "react-hot-toast";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import { useSiteContext } from "@/components/providers/SiteProvider";

type Staff = {
  id: string;
  name: string | null;
  mobileNumber: string | null;
  pin: string | null;
  isBlocked: boolean;
  createdAt: Date;
  tenantRoleId?: string | null;
  tenantRole?: { name: string } | null;
  allocatedProjects?: { id: string }[];
};

export default function StaffClientPage({ 
  initialStaff,
  staffLimit,
  activeStaffCount,
  initialRoles = [],
  activeProjects = [],
  userRole = "OWNER",
  userPermissions = [],
  plan = "PRO"
}: { 
  initialStaff: Staff[],
  staffLimit: number,
  activeStaffCount: number,
  initialRoles?: any[],
  activeProjects?: any[],
  userRole?: string,
  userPermissions?: string[],
  plan?: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; actionText: string; actionStyle: string; hideCancel?: boolean; onConfirm: () => void } | null>(null);
  const router = useRouter();
  const { t } = useTenantPreferences();
  const { activeSiteId } = useSiteContext();

  const filteredStaff = activeSiteId === "ALL" 
    ? initialStaff 
    : initialStaff.filter(staff => staff.allocatedProjects?.some(p => p.id === activeSiteId));

  const canAddStaff = userRole === 'OWNER' || userRole === 'SUPER_ADMIN' || userPermissions.includes('staff.add');
  const canEditStaff = userRole === 'OWNER' || userRole === 'SUPER_ADMIN' || userPermissions.includes('staff.edit');
  const canDeleteStaff = userRole === 'OWNER' || userRole === 'SUPER_ADMIN' || userPermissions.includes('staff.delete');
  const hasActionColumn = canEditStaff || canDeleteStaff;

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
          <div className="flex gap-3">
            {canAddStaff && (
              <button 
                onClick={() => {
                  if (activeStaffCount >= staffLimit) {
                    handleConfirmAction(
                      t('staff_limit_reached') || "Staff Limit Reached",
                      t('staff_limit_message')?.replace('{limit}', staffLimit.toString()) || `You have reached your limit of ${staffLimit} active staff members. Please upgrade your plan or block an existing staff member to add more.`,
                      t('understood') || "Understood",
                      "bg-primary-600 hover:bg-primary-700",
                      () => {},
                      true // hide cancel button
                    );
                    return;
                  }
                  setEditData(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all bg-primary-900 dark:bg-accent text-white shadow-primary-900/20 dark:shadow-accent/20 hover:opacity-90 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                {t('add_staff')}
              </button>
            )}
          </div>
        </div>

      {plan === "FREE" ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden p-8 sm:p-12 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-accent-50 dark:bg-accent-900/30 rounded-full flex items-center justify-center text-accent-500 mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Team Management is a Pro Feature</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Upgrade to the Pro Plan to invite your staff, assign them specific roles, and allocate them to different projects with restricted access.
          </p>
          <a href="/pricing" className="inline-block px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold shadow-lg shadow-accent-500/30 transition-all active:scale-[0.98]">
            Upgrade to Pro - Just ₹299/mo
          </a>
        </div>
      ) : (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{t('no_staff_yet')}</p>
            <p className="mt-1">{t('add_staff_desc')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-slate-400">
              <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 font-semibold border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('name')}</th>
                  <th className="px-6 py-4">{t('mobile_number')}</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">{t('login_pin')}</th>
                  <th className="px-6 py-4">{t('status')}</th>
                  <th className="px-6 py-4">{t('added_on')}</th>
                  {hasActionColumn && <th className="px-6 py-4 text-right">{t('actions')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{staff.name}</td>
                    <td className="px-6 py-4">{staff.mobileNumber}</td>
                    <td className="px-6 py-4">
                      {staff.tenantRole ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 whitespace-nowrap">
                          {staff.tenantRole.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-slate-500 text-sm">Staff (Default)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-700 dark:text-slate-300 tracking-wider font-semibold">
                        {staff.pin || t('not_set')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {t('blocked')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {t('active')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(staff.createdAt).toLocaleDateString()}</td>
                    {hasActionColumn && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 shrink-0">
                          {canEditStaff && (
                            <button 
                              onClick={() => {
                                setEditData(staff);
                                setIsModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 hover:text-primary-800 dark:hover:text-primary-300 font-medium transition-colors"
                            >
                              {t('edit')}
                            </button>
                          )}
                        {canDeleteStaff && (
                          <>
                            {staff.isBlocked ? (
                              <button 
                                onClick={() => handleToggleBlock(staff.id, false)}
                                disabled={isDeleting === staff.id}
                                className="px-3 py-1.5 rounded-lg text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium disabled:opacity-50 transition-colors"
                              >
                                {isDeleting === staff.id ? "..." : t('unblock')}
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleToggleBlock(staff.id, true)}
                                disabled={isDeleting === staff.id}
                                className="px-3 py-1.5 rounded-lg text-sm bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-800 dark:hover:text-amber-300 font-medium disabled:opacity-50 transition-colors"
                              >
                                {isDeleting === staff.id ? "..." : t('block')}
                              </button>
                            )}
                            <button 
                              onClick={() => handleConfirmAction(
                                t('remove_staff_member') || "Remove Staff Member",
                                t('remove_staff_confirm') || "Are you sure you want to remove this staff member? If they have logged expenses, they will be blocked instead to preserve financial records.",
                                t('remove') || "Remove",
                                "bg-red-500 hover:bg-red-600",
                                () => handleDelete(staff.id)
                              )}
                              disabled={isDeleting === staff.id}
                              className="px-3 py-1.5 rounded-lg text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-800 dark:hover:text-red-300 font-medium disabled:opacity-50 transition-colors"
                            >
                              {isDeleting === staff.id ? "..." : t('remove')}
                            </button>
                          </>
                        )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      <AddStaffModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSuccess={() => {
          router.refresh();
        }}
        editData={editData}
        roles={initialRoles}
        activeProjects={activeProjects}
      />
      
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => confirmModal.hideCancel ? confirmModal.onConfirm() : setConfirmModal(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 border border-gray-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{confirmModal.title}</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-8">{confirmModal.message}</p>
            <div className="flex gap-3">
              {!confirmModal.hideCancel && (
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('cancel')}
                </button>
              )}
              <button 
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${confirmModal.actionStyle}`}
              >
                {confirmModal.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
