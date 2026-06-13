"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const [active, setActive] = useState(0);

  const items = [
    {
      quote: t("items.0.quote"),
      name: t("items.0.name"),
      role: t("items.0.role"),
      location: t("items.0.location"),
    },
    {
      quote: t("items.1.quote"),
      name: t("items.1.name"),
      role: t("items.1.role"),
      location: t("items.1.location"),
    },
    {
      quote: t("items.2.quote"),
      name: t("items.2.name"),
      role: t("items.2.role"),
      location: t("items.2.location"),
    },
  ];

  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);
  const next = () => setActive((a) => (a + 1) % items.length);

  return (
    <section className="py-24 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center hero-line-wrapper
            text-gold text-xs font-bold uppercase tracking-widest">
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
        </div>

        {/* ── Carousel ── */}
        <div className="relative">

          {/* Cards track */}
          <div className="flex gap-6 transition-transform duration-500"
            style={{ transform: `translateX(calc(-${active * 100}% - ${active * 24}px))` }}>
            {items.map((item, i) => (
              <div
                key={i}
                className={`relative shrink-0 w-full flex flex-col gap-6 p-8
                  rounded-3xl border transition-all duration-500
                  ${i === active
                    ? "bg-white dark:bg-[#1c1714] border-purple/20 dark:border-gold/20 shadow-2xl shadow-purple/5 dark:shadow-gold/5 scale-100"
                    : "bg-warm-gray dark:bg-warm-gray/10 border-border scale-95 opacity-60"
                  }`}
              >
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-purple/20 dark:text-gold/20" />

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-foreground/80 text-base leading-relaxed italic flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  {/* Avatar initials */}
                  <div className="w-11 h-11 rounded-full
                    bg-purple/10 dark:bg-gold/10
                    flex items-center justify-center shrink-0">
                    <span
                      className="font-bold text-purple dark:text-gold text-sm"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-foreground/40 text-xs">
                      {item.role} · {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overflow clip wrapper — wrap the track */}
          <style>{`.testimonial-clip { overflow: hidden; }`}</style>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="p-3 rounded-full border border-border
              hover:border-purple dark:hover:border-gold
              hover:text-purple dark:hover:text-gold
              text-foreground/40 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300
                  ${i === active
                    ? "w-6 h-2.5 bg-purple dark:bg-gold"
                    : "w-2.5 h-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="p-3 rounded-full border border-border
              hover:border-purple dark:hover:border-gold
              hover:text-purple dark:hover:text-gold
              text-foreground/40 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}