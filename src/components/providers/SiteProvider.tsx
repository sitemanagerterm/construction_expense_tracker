"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Project = {
  id: string;
  name: string;
};

type SiteContextType = {
  activeSiteId: string; // "ALL" represents all sites
  setActiveSiteId: (id: string) => void;
  activeProjects: Project[];
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({
  children,
  initialProjects = [],
}: {
  children: React.ReactNode;
  initialProjects?: Project[];
}) {
  const [activeSiteId, setActiveSiteId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeSiteId");
      if (saved && (saved === "ALL" || initialProjects.some(p => p.id === saved))) {
        return saved;
      }
    }
    return initialProjects.length > 0 ? initialProjects[0].id : "ALL";
  });
  
  const [activeProjects, setActiveProjects] = useState<Project[]>(initialProjects);

  // Persist activeSiteId to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeSiteId", activeSiteId);
    }
  }, [activeSiteId]);

  // Sync projects if they change on the server
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setActiveProjects(initialProjects);
  }, [initialProjects?.length]);

  return (
    <SiteContext.Provider value={{ activeSiteId, setActiveSiteId, activeProjects }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
}
