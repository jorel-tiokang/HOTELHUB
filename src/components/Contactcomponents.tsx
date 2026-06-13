"use client";

import { useTranslations } from "next-intl";

const CONTACT_IMG =
  "https://plus.unsplash.com/premium_photo-1661776594516-6895a89de126?w=800&auto=format&fit=crop&q=95&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjBjb250YWN0fGVufDB8fDB8fHww";

/* ═══════════════════════════════════════════════════════════
   SOCIAL ICONS  (inline SVG — no extra dependency)
═══════════════════════════════════════════════════════════ */
function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT BLOCK  (reusable row unit)
═══════════════════════════════════════════════════════════ */
function ContactBlock({
  label,
  lines,
}: {
  label: string;
  lines: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-foreground/40 text-xs uppercase tracking-[0.2em] font-medium">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        {lines.map((line) => {
          const isEmail = line.includes("@");
          const isPhone = line.startsWith("+");
          if (isEmail) {
            return (
              <a
                key={line}
                href={`mailto:${line}`}
                className="text-foreground font-semibold text-base
                  hover:text-purple dark:hover:text-gold transition-colors"
              >
                {line}
              </a>
            );
          }
          if (isPhone) {
            return (
              <a
                key={line}
                href={`tel:${line.replace(/\s/g, "")}`}
                className="text-foreground font-semibold text-base
                  hover:text-purple dark:hover:text-gold transition-colors"
              >
                {line}
              </a>
            );
          }
          return (
            <p key={line} className="text-foreground font-semibold text-base">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const t = useTranslations("contact");

  const socials = [
    {
      label: "Telegram",
      href: "https://t.me/hotelhub",
      icon: IconTelegram,
    },
    {
      label: "Facebook",
      href: "https://facebook.com/hotelhub",
      icon: IconFacebook,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/hotelhub",
      icon: IconInstagram,
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-28 pb-0">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── TOP SECTION: heading left + contacts right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 pb-20
          border-b border-border">

          {/* Left: heading + subtitle */}
          <div className="flex flex-col gap-5 lg:pt-2">
            <h1
              className="text-5xl sm:text-6xl font-black text-foreground leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("title")}
            </h1>
            <p className="text-foreground/50 text-sm leading-relaxed max-w-[220px]">
              {t("subtitle")}
            </p>
          </div>

          {/* Right: 2×2 contact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-12">
            <ContactBlock
              label={t("inquiries.label")}
              lines={[t("inquiries.email"), t("inquiries.phone")]}
            />
            <ContactBlock
              label={t("careers.label")}
              lines={[t("careers.email")]}
            />
            <ContactBlock
              label={t("partnerships.label")}
              lines={[t("partnerships.email"), t("partnerships.phone")]}
            />
            <ContactBlock
              label={t("address.label")}
              lines={[t("address.line1"), t("address.line2")]}
            />
          </div>
        </div>

        {/* ── BOTTOM SECTION: socials left + image right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 pt-14 pb-0">

          {/* Social links */}
          <div className="flex flex-col gap-5">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 w-fit
                  text-foreground/60 hover:text-foreground
                  transition-colors duration-200"
              >
                <Icon className="w-4 h-4 text-foreground/30
                  group-hover:text-purple dark:group-hover:text-gold
                  transition-colors duration-200 shrink-0" />
                <span className="text-base font-medium">{label}</span>
              </a>
            ))}
          </div>

          {/* Image — flush to bottom, no border-radius on top like HORIZON */}
          <div className="relative h-[320px] lg:h-[380px] overflow-hidden
            rounded-t-3xl">
            <img
              src={CONTACT_IMG}
              alt="Hotel room"
              className="absolute inset-0 w-full h-full object-cover
                hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle purple tint overlay */}
            <div className="absolute inset-0
              bg-gradient-to-br from-purple/10 to-transparent
              dark:from-gold/5 dark:to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </main>
  );
}