"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { dictionaries, Dictionary } from "@/lib/i18n/dictionaries";
import { formatCurrency as formatCurrencyUtil } from "@/lib/utils";

type TenantPreferencesContextType = {
  language: string;
  currency: string;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
};

const TenantPreferencesContext = createContext<TenantPreferencesContextType | undefined>(undefined);

export function TenantPreferencesProvider({
  children,
  language = "en",
  currency = "INR",
}: {
  children: ReactNode;
  language?: string;
  currency?: string;
}) {
  const dictionary: Dictionary = dictionaries[language] || dictionaries["en"];

  const t = (key: string): string => {
    return dictionary[key] || dictionaries["en"][key] || key;
  };

  const formatCurrency = (amount: number): string => {
    return formatCurrencyUtil(amount, currency);
  };

  return (
    <TenantPreferencesContext.Provider value={{ language, currency, t, formatCurrency }}>
      {children}
    </TenantPreferencesContext.Provider>
  );
}

export function useTenantPreferences() {
  const context = useContext(TenantPreferencesContext);
  if (context === undefined) {
    throw new Error("useTenantPreferences must be used within a TenantPreferencesProvider");
  }
  return context;
}
