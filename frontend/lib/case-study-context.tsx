"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CaseStudyContextType = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const CaseStudyContext = createContext<CaseStudyContextType | null>(null);

export function CaseStudyProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <CaseStudyContext.Provider value={{ openId, setOpenId }}>
      {children}
    </CaseStudyContext.Provider>
  );
}

export function useCaseStudy() {
  const ctx = useContext(CaseStudyContext);
  if (!ctx) throw new Error("useCaseStudy must be used within CaseStudyProvider");
  return ctx;
}