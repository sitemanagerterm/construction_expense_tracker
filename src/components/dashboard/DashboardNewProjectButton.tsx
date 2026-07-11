"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ProjectFormModal from "@/components/projects/ProjectFormModal";

export default function DashboardNewProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="hidden sm:flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 hover:bg-primary-800 transition-all hover:-translate-y-0.5"
      >
        <FaPlus className="text-xs" /> New Project
      </button>

      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          // Server actions and revalidatePath will handle the UI refresh!
        }} 
      />
    </>
  );
}
