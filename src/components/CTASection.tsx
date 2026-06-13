"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="py-24 px-4 bg-warm-gray dark:bg-warm-gray/10">
      <div className="max-w-5xl mx-auto">

        {/* ── Card ── */}
        <div className="relative overflow-hidden rounded-3xl
          bg-purple dark:bg-gradient-to-br dark:from-[#1c1714] dark:to-[#2a2522]
          border border-purple/20 dark:border-gold/20
          px-8 py-16 sm:py-20 flex flex-col items-center text-center gap-8
          shadow-2xl shadow-purple/20 dark:shadow-gold/10">

          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80
              rounded-full bg-white/5 dark:bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80
              rounded-full bg-white/5 dark:bg-purple/10 blur-3xl" />
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg, transparent, transparent 40px,
                  rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px
                ), repeating-linear-gradient(
                  90deg, transparent, transparent 40px,
                  rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px
                )`
              }}
            />
          </div>

          {/* Badge */}
          <span className="relative inline-flex items-center gap-2 px-4 py-1.5
            rounded-full bg-white/15 dark:bg-gold/10
            border border-white/25 dark:border-gold/20
            text-white dark:text-gold text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {t("badge")}
          </span>

          {/* Heading */}
          <h2
            className="relative text-4xl sm:text-5xl lg:text-6xl font-black
              text-white dark:text-foreground leading-tight max-w-2xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}{" "}
            <span className="text-gold dark:text-gold italic">
              {t("titleAccent")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="relative text-white/70 dark:text-foreground/60
            text-base leading-relaxed max-w-xl">
            {t("subtitle")}
          </p>

          {/* Buttons */}
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/hotels`}
              className="flex items-center gap-2 px-8 py-4 rounded-xl
                bg-white dark:bg-gold
                text-purple dark:text-[#1c1714]
                font-bold text-sm
                hover:bg-white/90 dark:hover:bg-gold/90
                shadow-xl shadow-black/20
                transition-all duration-200 group"
            >
              {t("button")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}#about`}
              className="flex items-center gap-2 px-8 py-4 rounded-xl
                border border-white/30 dark:border-gold/30
                text-white dark:text-foreground
                font-semibold text-sm
                hover:bg-white/10 dark:hover:bg-gold/5
                transition-all duration-200"
            >
              {t("secondaryButton")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}