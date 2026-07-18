import React from "react";
import ProjectList from "@/components/projects/ProjectList";
import { getProjects } from "@/app/actions/projects";

export const metadata = {
  title: "Projects | MySiteBook",
  description: "Manage your construction sites and projects.",
};

export default async function ProjectsPage() {
  const res = await getProjects();
  const initialProjects = res.success ? res.data : [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ProjectList initialProjects={initialProjects || []} />
      </div>
    </div>
  );
}
