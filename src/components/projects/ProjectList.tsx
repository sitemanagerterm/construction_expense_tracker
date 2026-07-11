"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useTenantPreferences } from "@/components/providers/TenantProvider";
import ProjectFormModal from "./ProjectFormModal";
import SmartExpenseForm from "../expenses/SmartExpenseForm";
import { updateProjectStatus, deleteProject } from "@/app/actions/projects";

type ProjectListProps = {
  initialProjects: any[];
  activeCount?: number;
  completedCount?: number;
};

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const router = useRouter();
  const { currency } = useTenantPreferences();
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [expenseModalProjectId, setExpenseModalProjectId] = useState<string | null>(null);

  
  // Format Date Helper
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-IN", { 
      day: 'numeric', month: 'short', year: 'numeric' 
    }).format(new Date(dateString));
  };

  const handleAddProject = (newProject: any) => {
    setProjects([newProject, ...projects]);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "COMPLETED" : "ACTIVE";
    // Optimistic update
    setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    // Server action
    const res = await updateProjectStatus(id, newStatus);
    if (!res.success) {
      // Revert on failure
      setProjects(projects.map(p => p.id === id ? { ...p, status: currentStatus } : p));
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    const previousProjects = [...projects];
    setProjects(projects.filter(p => p.id !== id));

    const res = await deleteProject(id);
    if (!res.success) {
      // Revert on failure
      setProjects(previousProjects);
      alert("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects & Sites</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your construction sites and track budgets.</p>
        </div>
        <button 
          onClick={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 hover:bg-primary-800 transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-16 border border-gray-100 shadow-sm w-full mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-brandtext mb-5 border border-gray-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto text-center">Create your first construction site to start tracking expenses, assigning staff, and managing materials.</p>
          <button 
            onClick={() => {
              setProjectToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white font-bold text-sm rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const totalSpent = project.totalSpent || 0;
            return (
            <div key={project.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="pr-4">
                  <h3 className="text-base font-semibold text-brandtext line-clamp-1">{project.name}</h3>
                  {project.clientName && (
                    <p className="text-xs text-brandtext-secondary mt-1 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {project.clientName}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(project.id, project.status)}
                    title={project.status === 'ACTIVE' ? 'Mark Completed' : 'Mark Active'}
                    className={`shrink-0 inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${project.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-gray-50 text-brandtext-secondary border-gray-200 hover:bg-gray-100'}`}
                  >
                    {project.status}
                  </button>
                  <button 
                    onClick={() => {
                      setProjectToEdit(project);
                      setIsModalOpen(true);
                    }}
                    className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit Project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button 
                    onClick={() => setProjectToDelete(project.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-brandtext-secondary text-sm mb-4 line-clamp-2 flex-grow">{project.description}</p>
              )}
              {!project.description && <div className="flex-grow"></div>}

              {/* Budget & Date */}
              <div className="mb-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Budget</p>
                    <p className="font-bold text-gray-900">{project.budget ? formatCurrency(project.budget, currency) : "Not Set"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Spent</p>
                    <p className={`font-bold ${totalSpent > (project.budget || 0) && project.budget ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatCurrency(totalSpent, currency)}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                  {project.budget ? (
                    <div 
                      className={`h-full rounded-full ${(project.totalSpent || 0) > project.budget ? 'bg-red-500' : 'bg-accent'}`} 
                      style={{ width: `${Math.min(((project.totalSpent || 0) / project.budget) * 100, 100)}%` }}
                    ></div>
                  ) : (
                    <div className="h-full bg-accent rounded-full w-0"></div>
                  )}
                </div>
                {project.budget && (
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-brandtext-secondary">Spent: ₹{(project.totalSpent || 0).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-brandtext-secondary">{Math.round(((project.totalSpent || 0) / project.budget) * 100)}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-3">
                   <p className="text-xs text-gray-400">Added {formatDate(project.createdAt)}</p>
                   <div className="flex flex-col items-end gap-1">
                     {project.startDate && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brandtext-secondary bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Start: {new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {project.endDate && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        End: {new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                   </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                <a href={`/dashboard/projects/${project.id}`} className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-brandtext hover:bg-gray-100 transition-colors text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  View
                </a>
                <button 
                  onClick={() => setExpenseModalProjectId(project.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-brandtext hover:bg-gray-100 transition-colors text-xs font-semibold"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  Add Expense
                </button>
              </div>

            </div>
            );
          })}
        </div>
      )}

      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }} 
        onSuccess={(updatedProject) => {
          if (projectToEdit) {
            setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
          } else {
            handleAddProject(updatedProject);
          }
        }} 
        editData={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Project?</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleDelete(projectToDelete);
                    setProjectToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {expenseModalProjectId && (
        <SmartExpenseForm 
          projects={projects} 
          initialProjectId={expenseModalProjectId}
          onClose={() => setExpenseModalProjectId(null)}
          onSuccess={() => setExpenseModalProjectId(null)}
        />
      )}
    </div>
  );
}
