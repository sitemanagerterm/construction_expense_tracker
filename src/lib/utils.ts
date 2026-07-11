import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencyCode: string = "INR"): string {
  // Mapping of common currency codes to locales for proper formatting
  const locales: Record<string, string> = {
    "INR": "en-IN",
    "USD": "en-US",
    "SGD": "en-SG",
    "AED": "ar-AE",
    "EUR": "en-IE",
    "GBP": "en-GB"
  };

  const locale = locales[currencyCode] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getCurrencySymbol(currencyCode: string = "INR"): string {
  const locales: Record<string, string> = {
    "INR": "en-IN",
    "USD": "en-US",
    "SGD": "en-SG",
    "AED": "ar-AE",
    "EUR": "en-IE",
    "GBP": "en-GB"
  };
  const locale = locales[currencyCode] || "en-US";
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    });
    const parts = formatter.formatToParts(0);
    const currencyPart = parts.find(part => part.type === 'currency');
    return currencyPart ? currencyPart.value : currencyCode;
  } catch (e) {
    return currencyCode;
  }
}
