"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function TrustSection() {
  const t = useTranslations("trust");
  const locale = useLocale();

  const items = [
    t("items.0.label"),
    t("items.1.label"),
    t("items.2.label"),
    t("items.3.label"),
  ];

  /* Placeholder hotel images — replace with real ones */
  const images = [
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
      alt: "Hotel lobby",
      className: "col-span-2 row-span-2",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
      alt: "Hotel exterior",
    },
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
      alt: "Hotel pool",
    },
    {
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Hotel room",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjByZXN0YXVyYW50fGVufDB8fDB8fHww",
      alt: "Hotel restaurant",
    },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: image collage ── */}
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[420px]">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden bg-warm-gray
                  dark:bg-warm-gray/20
                  ${img.className ?? ""}`}
              >
                {/* Fallback gradient if image missing */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br
                  ${
                    i === 0
                      ? "from-purple/20 to-purple/40 dark:from-gold/10 dark:to-gold/25"
                      : i % 2 === 0
                        ? "from-warm-gray to-warm-gray/50 dark:from-white/5 dark:to-white/10"
                        : "from-purple/10 to-warm-gray dark:from-gold/5 dark:to-white/5"
                  }`}
                />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => {
                    /* fallback */
                  }}
                />
              </div>
            ))}

            {/* Floating stat badge */}
            <div
              className="absolute -bottom-4 -right-4 hidden lg:flex
              items-center gap-3 px-5 py-3
              bg-white dark:bg-[#1c1714]
              border border-border rounded-2xl shadow-xl"
            >
              <div
                className="w-10 h-10 rounded-full bg-purple/10 dark:bg-gold/10
                flex items-center justify-center"
              >
                <span
                  className="text-purple dark:text-gold font-black text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  4.8
                </span>
              </div>
              <div>
                <p className="text-foreground font-bold text-sm">
                  {t("rating")}
                </p>
                <p className="text-foreground/40 text-xs">+2400 avis</p>
              </div>
            </div>
          </div>

          {/* ── Right: text content ── */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <span
              className="inline-flex hero-line-wrapper items-center 
              text-purple dark:text-gold 
              text-xs font-bold uppercase tracking-widest  "
            >
              {t("badge")}
            </span>

            {/* Heading */}
            <h2
              className="text-4xl sm:text-5xl font-black text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("title")}{" "}
              <span className="text-purple dark:text-gold italic">
                {t("titleAccent")}
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-foreground/60 text-base leading-relaxed max-w-md">
              {t("subtitle")}
            </p>

            {/* Checklist */}
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple dark:text-gold shrink-0" />
                  <span className="text-foreground/80 text-sm font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={`/${locale}/hotels`}
              className="inline-flex items-center gap-2 w-fit px-7 py-3.5
                rounded-xl font-bold text-sm
                bg-purple text-white dark:bg-gold dark:text-[#1c1714]
                hover:bg-purple/90 dark:hover:bg-gold/90
                shadow-lg shadow-purple/25 dark:shadow-gold/25
                transition-all duration-200 group"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-foreground/30 text-xs">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
