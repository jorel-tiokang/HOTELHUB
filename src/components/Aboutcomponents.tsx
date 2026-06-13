"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RevealSection from "./revealSection";

/* ═══════════════════════════════════════════════════════════
   UNSPLASH IMAGES
═══════════════════════════════════════════════════════════ */
const IMG = {
  hero: "https://images.pexels.com/photos/9198187/pexels-photo-9198187.jpeg",
  mission:
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80&auto=format&fit=crop",
  story1:
    "https://plus.unsplash.com/premium_photo-1723651354432-7796fb4ecebc?w=500&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2hlcmUlMjB0byUyMGdvfGVufDB8fDB8fHww",
  story2:
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80&auto=format&fit=crop",
  cta: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1800&q=85&auto=format&fit=crop",
};

/* ═══════════════════════════════════════════════════════════
   CUSTOM SVG ICONS  (not lucide-react)
═══════════════════════════════════════════════════════════ */
function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L3.5 6.5v5c0 4.42 3.58 8.5 8.5 9.5 4.92-1 8.5-5.08 8.5-9.5v-5L12 2z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" />
      <path d="M3.5 9h17M3.5 15h17" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════ */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center hero-line-wrapper
      text-purple dark:text-gold
      text-xs font-bold uppercase tracking-widest w-fit"
    >
      {children}
    </span>
  );
}

function SectionHeading({
  normal,
  accent,
  light = false,
}: {
  normal: string;
  accent: string;
  light?: boolean;
}) {
  return (
    <h2
      className={`text-4xl sm:text-5xl font-black leading-tight
        ${light ? "text-white" : "text-foreground"}`}
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {normal}{" "}
      <span
        className={`italic ${light ? "text-gold" : "text-purple dark:text-gold"}`}
      >
        {accent}
      </span>
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. HERO
═══════════════════════════════════════════════════════════ */
function AboutHero() {
  const t = useTranslations("about.hero");

  return (
    <section className="relative h-[90vh] min-h-[540px] flex items-end overflow-hidden">
      {/* Background */}
      <img
        src={IMG.hero}
        alt="Hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

      {/* Content pinned to bottom-left like RENOVA */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 flex flex-col
        sm:flex-row sm:items-end sm:justify-between gap-8"
      >
        <div className="flex flex-col gap-5 max-w-2xl">
          <SectionBadge>{t("badge")}</SectionBadge>
          <h1
            className="text-5xl sm:text-7xl font-black text-white leading-[1.0]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}{" "}
            <span className="text-gold italic">{t("titleAccent")}</span>
          </h1>
        </div>

        {/* Right side subtitle like RENOVA's bottom-right text */}
        <p className="text-white/60 text-sm leading-relaxed max-w-xs sm:text-right">
          {t("subtitle")}
        </p>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20
        bg-gradient-to-t from-background to-transparent pointer-events-none"
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. MISSION
═══════════════════════════════════════════════════════════ */
function AboutMission() {
  const t = useTranslations("about.mission");

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative h-[480px] rounded-3xl overflow-hidden">
          <img
            src={IMG.mission}
            alt="Our mission"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Floating stat */}
          <div
            className="absolute bottom-6 left-6 right-6
            bg-white/90 dark:bg-[#1c1714]/90 backdrop-blur-md
            rounded-2xl px-6 py-4 border border-border
            flex justify-between items-center gap-4"
          >
            {[
              { v: t("stat1Value"), l: t("stat1Label") },
              { v: t("stat2Value"), l: t("stat2Label") },
              { v: t("stat3Value"), l: t("stat3Label") },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p
                  className="text-2xl font-black text-purple dark:text-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {v}
                </p>
                <p className="text-foreground/50 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-7">
          <SectionBadge>{t("badge")}</SectionBadge>
          <SectionHeading normal={t("title")} accent={t("titleAccent")} />
          <p className="text-foreground/65 text-base leading-relaxed">
            {t("body1")}
          </p>
          <p className="text-foreground/65 text-base leading-relaxed">
            {t("body2")}
          </p>

          {/* Decorative line */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-purple/40 to-transparent dark:from-gold/30" />
            <span className="text-purple/40 dark:text-gold/40 text-xl">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. STORY  (alternating image + text)
═══════════════════════════════════════════════════════════ */
function StoryBlock({
  image,
  badge,
  title,
  accent,
  body,
  reverse = false,
}: {
  image: string;
  badge: string;
  title: string;
  accent: string;
  body: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
        ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Image */}
      <div className="relative h-[380px] rounded-3xl overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover
            transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-6">
        <SectionBadge>{badge}</SectionBadge>
        <SectionHeading normal={title} accent={accent} />
        <p className="text-foreground/65 text-base leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function AboutStory() {
  const t = useTranslations("about.story");

  return (
    <section className="py-24 px-6 bg-warm-gray dark:bg-warm-gray/10">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        {/* Section label — RENOVA style */}
        <div className="flex items-center gap-6 border-b border-border pb-6">
          <span className="text-foreground/30 text-xs uppercase tracking-[0.3em] font-semibold">
            {t("sectionLabel")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <StoryBlock
          image={IMG.story1}
          badge={t("block1Badge")}
          title={t("block1Title")}
          accent={t("block1Accent")}
          body={t("block1Body")}
        />

        <StoryBlock
          image={IMG.story2}
          badge={t("block2Badge")}
          title={t("block2Title")}
          accent={t("block2Accent")}
          body={t("block2Body")}
          reverse
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. VALUES  (staggered 2×2 grid — not horizontally aligned)
═══════════════════════════════════════════════════════════ */
const VALUE_ICONS = [IconShield, IconGlobe, IconStar, IconHeart];

const VALUE_OFFSETS = [
  "mt-0", // card 1 — col 1, top
  "mt-16", // card 2 — col 2, pushed down
  "mt-8", // card 3 — col 1, slightly down
  "mt-4", // card 4 — col 2
];

function AboutValues() {
  const t = useTranslations("about.values");

  const items = [
    { num: "01", title: t("items.0.title"), desc: t("items.0.desc") },
    { num: "02", title: t("items.1.title"), desc: t("items.1.desc") },
    { num: "03", title: t("items.2.title"), desc: t("items.2.desc") },
    { num: "04", title: t("items.3.title"), desc: t("items.3.desc") },
  ];

  /* Split into two columns: [0,2] and [1,3] */
  const col1 = [items[0], items[2]];
  const col2 = [items[1], items[3]];

  function ValueCard({
    item,
    index,
  }: {
    item: (typeof items)[0];
    index: number;
  }) {
    const Icon = VALUE_ICONS[index];
    return (
      <div
        className={`group relative flex flex-col gap-5 p-8
          bg-white dark:bg-[#1c1714]
          rounded-bl-2xl rounded-tr-2xl border border-border
          hover:border-purple/30 dark:hover:border-gold/30
          shadow-sm hover:shadow-xl hover:shadow-purple/5 dark:hover:shadow-gold/5
          transition-all duration-300
          ${VALUE_OFFSETS[index]}`}
      >
        {/* Number watermark */}
        <span
          className="absolute top-6 right-7 text-7xl font-black
            text-foreground/[0.035] dark:text-white/[0.04]
            select-none pointer-events-none leading-none"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {item.num}
        </span>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center
          bg-purple/8 dark:bg-gold/8
          group-hover:scale-110 transition-transform duration-300"
        >
          <Icon className="w-7 h-7 text-purple dark:text-gold" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 relative">
          <h3
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {item.title}
          </h3>
          <p className="text-foreground/55 text-sm leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full
            bg-gradient-to-r from-purple/0 via-purple/50 to-purple/0
            dark:via-gold/50
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    );
  }

  return (
    <section className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <SectionBadge>{t("badge")}</SectionBadge>
            <SectionHeading normal={t("title")} accent={t("titleAccent")} />
          </div>
          <p className="text-foreground/55 text-sm leading-relaxed max-w-xs sm:text-right">
            {t("subtitle")}
          </p>
        </div>

        {/* Staggered 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-16">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {col1.map((item, i) => (
              <ValueCard key={item.num} item={item} index={i === 0 ? 0 : 2} />
            ))}
          </div>
          {/* Column 2 — starts lower */}
          <div className="flex flex-col gap-6 sm:mt-16">
            {col2.map((item, i) => (
              <ValueCard key={item.num} item={item} index={i === 0 ? 1 : 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. CTA
═══════════════════════════════════════════════════════════ */
function AboutCTA() {
  const t = useTranslations("about.cta");
  const locale = useLocale();

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background image */}
      <img
        src={IMG.cta}
        alt="Hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/65 dark:bg-black/75" />

      {/* RENOVA-style big text watermark */}
      <p
        className="absolute bottom-0 left-0 right-0 text-center
          text-[clamp(4rem,15vw,14rem)] font-black text-white/[0.04]
          leading-none select-none pointer-events-none uppercase tracking-tighter"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        HOTELHUB
      </p>

      <div
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center
        text-center gap-8"
      >
        <h2
          className="text-4xl sm:text-6xl font-black text-white leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("title")}{" "}
          <span className="text-gold italic">{t("titleAccent")}</span>
        </h2>

        <p className="text-white/60 text-base leading-relaxed max-w-xl">
          {t("subtitle")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/hotels`}
            className="flex items-center gap-2 px-8 py-4 rounded-xl
              bg-purple dark:bg-gold
              text-white dark:text-[#1c1714]
              font-bold text-sm
              hover:bg-purple/90 dark:hover:bg-gold/90
              shadow-xl shadow-purple/30 dark:shadow-gold/20
              transition-all duration-200 group"
          >
            {t("button")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center gap-2 px-8 py-4 rounded-xl
              border border-white/30 text-white font-semibold text-sm
              hover:bg-white/10 transition-all duration-200"
          >
            {t("secondaryButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <main>
      <RevealSection delay={20}>
        {" "}
        <AboutHero />
      </RevealSection>
      <RevealSection delay={80}>
        <AboutMission />
      </RevealSection>
      <RevealSection delay={80}>
        <AboutStory />
      </RevealSection>

      <RevealSection delay={80}>
        <AboutValues />{" "}
      </RevealSection>
      <RevealSection delay={80}>
        <AboutCTA />
      </RevealSection>
    </main>
  );
}
