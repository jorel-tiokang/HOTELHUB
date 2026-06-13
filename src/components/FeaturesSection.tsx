"use client";

import { useTranslations } from "next-intl";
import { MapPin, Zap, ShieldCheck, BadgeDollarSign } from "lucide-react";

const ICONS = [MapPin, Zap, ShieldCheck, BadgeDollarSign];

const ICON_BG = [
  "bg-purple/10 dark:bg-purple/20 text-purple dark:text-purple",
  "bg-gold/10 dark:bg-gold/15 text-gold dark:text-gold",
  "bg-cyan/10 dark:bg-cyan/15 text-cyan dark:text-cyan",
  "bg-purple/10 dark:bg-purple/20 text-purple dark:text-purple",
];

export default function FeaturesSection() {
  const t = useTranslations("features");

  const features = [
    { title: t("items.0.title"), desc: t("items.0.desc") },
    { title: t("items.1.title"), desc: t("items.1.desc") },
    { title: t("items.2.title"), desc: t("items.2.desc") },
    { title: t("items.3.title"), desc: t("items.3.desc") },
  ];

  return (
    <section className="py-24 px-4 bg-warm-gray dark:bg-warm-gray/10">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* ── Section header ── */}
        <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
          <span className="inline-flex items-center hero-line-wrapper
            text-purple dark:text-gold text-xs font-bold uppercase tracking-widest">
            {t("badge")}
          </span>
          <h2
            className="text-4xl sm:text-5xl font-black text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}{" "}
            <span className="text-purple dark:text-gold italic">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-foreground/60 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* ── Feature cards ── */}
        {/* ── Premium Feature Cards ── */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {features.map((feature, i) => {
    const Icon = ICONS[i];
    return (
      <div
        key={feature.title}
        className="group relative overflow-hidden flex flex-col gap-6 p-8
          bg-white/40 dark:bg-[#1a1614]/80 backdrop-blur-md
          rounded-3xl border border-black/5 dark:border-white/10
          hover:shadow-2xl hover:shadow-purple/10 dark:hover:shadow-gold/20
          hover:-translate-y-2
          transition-all duration-500 ease-out z-10"
      >
        {/* Ambient Background Glow (Reveals smoothly on hover) */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full
          bg-purple/20 dark:bg-gold/20 blur-3xl opacity-0 group-hover:opacity-100
          transition-opacity duration-700 -z-10 pointer-events-none" />

        {/* Header: Icon & Minimalist Numbering */}
        <div className="flex justify-between items-start">
          {/* Floating Icon Container */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl
            bg-white dark:bg-[#251f1b] border border-black/5 dark:border-white/5
            shadow-sm group-hover:scale-110 transition-transform duration-500"
          >
            {/* Ensure you map your icon colors here if they differ */}
            <Icon className="w-6 h-6 text-purple dark:text-gold" />
          </div>

          {/* Refined Slash Numbering instead of a giant watermark */}
          <span
            className="text-sm font-bold text-foreground/30 dark:text-white/30 tracking-widest"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            /{String(i + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-3 relative z-10 mt-2">
          <h3
            className="text-xl font-semibold text-foreground group-hover:text-purple dark:group-hover:text-gold transition-colors duration-300"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {feature.title}
          </h3>
          <p className="text-foreground/60 text-sm leading-relaxed font-medium">
            {feature.desc}
          </p>
        </div>

        {/* Animated Bottom Progress Border */}
        <div className="absolute bottom-0 left-0 w-0 h-1
          bg-gradient-to-r from-purple to-transparent dark:from-gold
          group-hover:w-full transition-all duration-700 ease-in-out" />
      </div>
    );
  })}
</div>
      </div>
    </section>
  );
}