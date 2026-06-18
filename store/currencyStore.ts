import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Supported currencies ─────────────────────────────────────────────────────
export type CurrencyCode = "XAF" | "EUR" | "USD";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "XAF", symbol: "FCFA", label: "Franc CFA", flag: "🇨🇲" },
  { code: "EUR", symbol: "€",    label: "Euro",       flag: "🇪🇺" },
  { code: "USD", symbol: "$",    label: "US Dollar",  flag: "🇺🇸" },
];

// ── Exchange rates relative to XAF (base = 1) ───────────────────────────────
// 1 XAF → X foreign currency
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  XAF: 1,
  EUR: 0.001524,  // 1 XAF ≈ 0.001524 EUR  (1 EUR ≈ 656 FCFA)
  USD: 0.001644,  // 1 XAF ≈ 0.001644 USD  (1 USD ≈ 608 FCFA)
};

// ── Store ────────────────────────────────────────────────────────────────────
interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "XAF",
      setCurrency: (code) => set({ currency: code }),
    }),
    {
      name: "hotelhub-currency", // persisted in localStorage
    },
  ),
);
