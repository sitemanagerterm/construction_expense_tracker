"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectFormModal from "@/components/projects/ProjectFormModal";

export default function NewProjectClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-accent-50 dark:bg-accent/10 rounded-full flex items-center justify-center text-accent-500 dark:text-accent mb-6 border-8 border-accent-50/50 dark:border-accent/5 shadow-sm">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Welcome to MySiteBook!</h2>
      <p className="text-gray-500 dark:text-slate-400 text-lg max-w-md mb-10 leading-relaxed font-medium">
        Get started by creating your very first project to track expenses, credits, and profit in real-time.
      </p>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-accent-500/30 transition-all active:scale-[0.98] flex items-center gap-3"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
        Create New Project
      </button>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newProject: any) => {
          setIsModalOpen(false);
          router.push(`/dashboard/projects/${newProject.id}`);
        }}
      />
    </div>
  );
}
