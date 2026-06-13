"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "fr" ? "en" : "fr";

  const switchLocale = () => {
    // Replace the current locale segment in the pathname
    // e.g. /fr/hotels → /en/hotels
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      aria-label={`Switch to ${otherLocale === "fr" ? "Français" : "English"}`}
      className="
        relative flex items-center gap-2 px-3 py-1.5
        rounded-full border border-white/20
        bg-white/10 backdrop-blur-sm
        text-white text-sm font-semibold
        hover:bg-white/20 hover:border-white/40
        dark:border-gold/20 dark:bg-charcoal/60
        dark:hover:bg-charcoal dark:hover:border-gold/40
        dark:text-white
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        select-none
      "
    >
      {/* Flag emoji + label */}
      <span className="text-base leading-none">
        {locale === "fr" ? "🇫🇷" : "🇬🇧"}
      </span>
      <span className="uppercase tracking-wider text-xs">
        {locale === "fr" ? "FR" : "EN"}
      </span>

      {/* Divider */}
      <span className="text-white/30 dark:text-gold/30">|</span>

      {/* Target locale hint */}
      <span className="text-white/60 dark:text-white/50 uppercase tracking-wider text-xs">
        {otherLocale === "fr" ? "FR" : "EN"}
      </span>

      {/* Loading spinner */}
      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
          <svg
            className="w-3.5 h-3.5 animate-spin text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </span>
      )}
    </button>
  );
}