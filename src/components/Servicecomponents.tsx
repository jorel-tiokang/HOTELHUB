"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   UNSPLASH IMAGES
═══════════════════════════════════════════════════════════ */
const IMG = {
  hero:     "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&auto=format&fit=crop&q=85",
  discover: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&auto=format&fit=crop&q=80",
  booking:  "https://images.pexels.com/photos/7820326/pexels-photo-7820326.jpeg",
  reviews:  "https://media.istockphoto.com/id/2151224243/photo/user-give-rating-to-service-experience-on-online-application-customer-review-satisfaction.jpg?b=1&s=612x612&w=0&k=20&c=pLndcwpXBI_GVr1kskxak30ue2kSBRXRxgODnI3JM80=",
  support:  "https://images.pexels.com/photos/7658369/pexels-photo-7658369.jpeg",
};

/* ═══════════════════════════════════════════════════════════
   CUSTOM SVG ICONS
═══════════════════════════════════════════════════════════ */
function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconHeadset({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const SERVICE_ICONS = [IconSearch, IconCalendar, IconStar, IconHeadset];

/* ═══════════════════════════════════════════════════════════
   SHARED PRIMITIVES  (same as About & Contact pages)
═══════════════════════════════════════════════════════════ */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 hero-line-wrapper
      text-purple dark:text-gold
      text-xs font-bold uppercase tracking-widest w-fit">
      {children}
    </span>
  );
}

function SectionHeading({
  normal,
  accent,
  light = false,
  center = false,
}: {
  normal: string;
  accent: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <h2
      className={`text-4xl sm:text-5xl font-black leading-tight
        ${light ? "text-white" : "text-foreground"}
        ${center ? "text-center" : ""}`}
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {normal}{" "}
      <span className={`italic ${light ? "text-gold" : "text-purple dark:text-gold"}`}>
        {accent}
      </span>
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. HERO
═══════════════════════════════════════════════════════════ */
function ServicesHero() {
  const t = useTranslations("services.hero");

  return (
    <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
      <img
        src={IMG.hero}
        alt="Hotel services"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16
        flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
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
        <p className="text-white/60 text-sm leading-relaxed max-w-xs sm:text-right">
          {t("subtitle")}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20
        bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. SERVICES  (alternating image + text blocks)
═══════════════════════════════════════════════════════════ */
function ServiceBlock({
  image,
  icon: Icon,
  badge,
  title,
  accent,
  body,
  perks,
  reverse = false,
  index,
}: {
  image: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  accent: string;
  body: string;
  perks: string[];
  reverse?: boolean;
  index: number;
}) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
        ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Image */}
      <div className="relative h-[400px] rounded-3xl overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover
            transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Service number watermark on image */}
        <span
          className="absolute bottom-5 right-6 text-8xl font-black
            text-white/10 leading-none select-none pointer-events-none"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-6">
        <SectionBadge>{badge}</SectionBadge>

        {/* Icon + heading row */}
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center
            bg-purple/10 dark:bg-gold/10">
            <Icon className="w-6 h-6 text-purple dark:text-gold" />
          </div>
          <SectionHeading normal={title} accent={accent} />
        </div>

        <p className="text-foreground/65 text-base leading-relaxed">{body}</p>

        {/* Perks list */}
        <ul className="flex flex-col gap-2.5">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center
                bg-purple/10 dark:bg-gold/10 shrink-0">
                <IconCheck className="w-3 h-3 text-purple dark:text-gold" />
              </span>
              <span className="text-foreground/70 text-sm">{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ServicesList() {
  const t = useTranslations("services.list");

  const services = [
    {
      image: IMG.discover,
      icon: SERVICE_ICONS[0],
      badge: t("s1.badge"),
      title: t("s1.title"),
      accent: t("s1.accent"),
      body: t("s1.body"),
      perks: [t("s1.p1"), t("s1.p2"), t("s1.p3")],
    },
    {
      image: IMG.booking,
      icon: SERVICE_ICONS[1],
      badge: t("s2.badge"),
      title: t("s2.title"),
      accent: t("s2.accent"),
      body: t("s2.body"),
      perks: [t("s2.p1"), t("s2.p2"), t("s2.p3")],
    },
    {
      image: IMG.reviews,
      icon: SERVICE_ICONS[2],
      badge: t("s3.badge"),
      title: t("s3.title"),
      accent: t("s3.accent"),
      body: t("s3.body"),
      perks: [t("s3.p1"), t("s3.p2"), t("s3.p3")],
    },
    {
      image: IMG.support,
      icon: SERVICE_ICONS[3],
      badge: t("s4.badge"),
      title: t("s4.title"),
      accent: t("s4.accent"),
      body: t("s4.body"),
      perks: [t("s4.p1"), t("s4.p2"), t("s4.p3")],
    },
  ];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col gap-28">
        {/* Section label — same editorial style as About story */}
        <div className="flex items-center gap-6 border-b border-border pb-6">
          <span className="text-foreground/30 text-xs uppercase tracking-[0.3em] font-semibold">
            {t("sectionLabel")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {services.map((s, i) => (
          <ServiceBlock key={s.badge} {...s} index={i} reverse={i % 2 !== 0} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. HOW IT WORKS  (4-step horizontal timeline)
═══════════════════════════════════════════════════════════ */
function HowItWorks() {
  const t = useTranslations("services.how");

  const steps = [
    { num: "01", title: t("step1.title"), desc: t("step1.desc") },
    { num: "02", title: t("step2.title"), desc: t("step2.desc") },
    { num: "03", title: t("step3.title"), desc: t("step3.desc") },
    { num: "04", title: t("step4.title"), desc: t("step4.desc") },
  ];

  return (
    <section className="py-24 px-6 bg-warm-gray dark:bg-warm-gray/10">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5">
          <SectionBadge>{t("badge")}</SectionBadge>
          <SectionHeading normal={t("title")} accent={t("titleAccent")} center />
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%]
            h-px bg-gradient-to-r from-transparent via-purple/30 dark:via-gold/30 to-transparent
            pointer-events-none" />

          {steps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col gap-4 items-start lg:items-center lg:text-center">
              {/* Number bubble */}
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center
                bg-white dark:bg-[#1c1714]
                border-2 border-purple/20 dark:border-gold/20
                shadow-md shadow-purple/5 dark:shadow-gold/5 shrink-0 z-10">
                <span
                  className="text-xl font-black text-purple dark:text-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.num}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3
                  className="text-base font-bold text-foreground"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.title}
                </h3>
                <p className="text-foreground/55 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Mobile connector arrow */}
              {i < steps.length - 1 && (
                <div className="lg:hidden w-px h-6 bg-border ml-8 self-start" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. CTA
═══════════════════════════════════════════════════════════ */
function ServicesCTA() {
  const t = useTranslations("services.cta");
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl
          bg-purple dark:bg-gradient-to-br dark:from-[#1c1714] dark:to-[#2a2522]
          border border-purple/20 dark:border-gold/20
          px-8 py-20 flex flex-col items-center text-center gap-8
          shadow-2xl shadow-purple/20 dark:shadow-gold/10">

          {/* Decorations */}
          <div className="absolute -top-20 -right-20 w-80 h-80
            rounded-full bg-white/5 dark:bg-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80
            rounded-full bg-white/5 dark:bg-purple/10 blur-3xl pointer-events-none" />

          {/* Big watermark text */}
          <p
            className="absolute bottom-0 left-0 right-0 text-center
              text-[clamp(3rem,12vw,11rem)] font-black text-white/[0.04]
              leading-none select-none pointer-events-none uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            HOTELHUB
          </p>

          <SectionBadge>{t("badge")}</SectionBadge>

          <h2
            className="relative text-4xl sm:text-5xl font-black text-white
              dark:text-foreground leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}{" "}
            <span className="text-gold italic">{t("titleAccent")}</span>
          </h2>

          <p className="relative text-white/65 dark:text-foreground/60
            text-base leading-relaxed max-w-md">
            {t("subtitle")}
          </p>

          <div className="relative flex flex-wrap gap-4 justify-center">
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
              href={`/${locale}/about`}
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

/* ═══════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════ */
export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesList />
      <HowItWorks />
      <ServicesCTA />
    </main>
  );
}