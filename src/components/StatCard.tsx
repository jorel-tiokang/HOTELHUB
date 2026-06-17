"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Optional subtle description line under the value */
  sub?: string;
  /** Highlight accent: "gold" | "emerald" | "purple" — defaults to "gold" */
  accent?: "gold" | "emerald" | "purple";
}

const ACCENT_CLASSES = {
  gold:    "text-gold",
  emerald: "text-emerald-400",
  purple:  "text-purple dark:text-purple",
};

const ICON_BG_CLASSES = {
  gold:    "bg-gold/10 text-gold",
  emerald: "bg-emerald-500/10 text-emerald-400",
  purple:  "bg-purple/10 text-purple",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent = "gold",
}: StatCardProps) {
  return (
    <div
      className="
        flex flex-col gap-3 p-5
        bg-charcoal rounded-2xl border border-white/10
        shadow-lg hover:-translate-y-1 hover:shadow-gold/10 hover:shadow-xl
        transition-all duration-300
      "
    >
      {/* Icon badge */}
      {Icon && (
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center
            ${ICON_BG_CLASSES[accent]}
          `}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
      )}

      {/* Value */}
      <p
        className={`text-3xl font-black leading-none ${ACCENT_CLASSES[accent]}`}
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {value}
      </p>

      {/* Label */}
      <div>
        <p className="text-white/70 text-sm font-medium leading-snug">{label}</p>
        {sub && <p className="text-white/35 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
