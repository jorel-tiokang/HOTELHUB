"use client";

import { useTransition } from "react";
import { CURRENCIES, useCurrencyStore } from "@/store/currencyStore";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrencyStore();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-full border border-foreground/10 bg-transparent">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          id={`currency-toggle-${c.code}`}
          disabled={isPending}
          onClick={() => startTransition(() => setCurrency(c.code))}
          title={c.label}
          aria-pressed={currency === c.code}
          className={`
            px-2.5 py-1 rounded-full text-xs font-bold tracking-wide
            transition-all duration-200 disabled:opacity-40
            ${
              currency === c.code
                ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] shadow"
                : "text-foreground/50 hover:text-foreground"
            }
          `}
        >
          {c.symbol === "FCFA" ? "XAF" : c.symbol}
        </button>
      ))}
    </div>
  );
}
