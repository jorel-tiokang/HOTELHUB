"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import Link from "next/link";
import CurrencyToggle from "@/src/components/CurrencyToggle";
import NotificationBell from "@/src/components/NotificationBell";

/* ── Theme Toggle ─────────────────────────────────────────── */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full transition-colors
        text-foreground/60 hover:text-foreground
        hover:bg-black/5 dark:hover:bg-white/10"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

/* ── Language Toggle ──────────────────────────────────────── */
function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const other = locale === "fr" ? "en" : "fr";

  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${other}`);
    startTransition(() => router.replace(newPath));
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      aria-label={`Switch language to ${other}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
        uppercase tracking-widest transition-all duration-200
        border border-foreground/10 hover:border-purple/50
        text-foreground/60 hover:text-purple
        dark:hover:text-gold dark:hover:border-gold/40
        disabled:opacity-40"
    >
      <Globe className="w-3.5 h-3.5" />
      {locale.toUpperCase()}
    </button>
  );
}

/* ── Header ───────────────────────────────────────────────── */
export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { key: "home", href: `/${locale}` },
    { key: "hotels", href: `/${locale}/hotels` },
    { key: "services", href: `/${locale}/services` },
    { key: "about", href: `/${locale}/about` },
    { key: "contact", href: `/${locale}/contact` },
  ] as const;

  return (
    <>
      {/* ── Floating pill header ── */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[calc(100%-2rem)] max-w-6xl
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "bg-white/80 dark:bg-[#1c1714]/90 shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xl border border-black/5 dark:border-gold/10"
              : "bg-white/40 dark:bg-[#1c1714]/50 backdrop-blur-md border border-white/20 dark:border-white/5"
          }
          rounded-2xl px-5 py-3`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple dark:bg-gold flex items-center justify-center shadow-md">
              <img
              src="/hotelhublogo.png"
              alt="HotelHub Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            </div>

            <span
              className="font-black text-lg text-purple group-hover:text-purple

dark:group-hover:text-gold transition-colors"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              HOTELHUB
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium
                  text-foreground/70 hover:text-foreground
                  transition-colors duration-150 text-underline"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <CurrencyToggle />
            <NotificationBell />
            <div className="w-px h-5 bg-foreground/10 mx-1" />
            <Link
              href={`/login`}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold
                text-foreground/70 hover:text-foreground
                hover:bg-black/5 dark:hover:bg-white/10
                transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="px-4 py-2 rounded-xl text-sm font-bold
                bg-purple text-white hover:bg-purple/90
                dark:bg-gold dark:text-[#1c1714] dark:hover:bg-gold/90
                shadow-md shadow-purple/20 dark:shadow-gold/20
                transition-all duration-200"
            >
              {t("bookNow")}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/70
              hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300
          ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
            ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72
            bg-white dark:bg-[#1c1714]
            shadow-2xl transition-transform duration-300 ease-out
            flex flex-col p-6 gap-6
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-black text-lg text-purple dark:text-gold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              HOTELHUB
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium
                  text-foreground/80 hover:text-foreground
                  hover:bg-black/5 dark:hover:bg-white/5
                  transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
              <NotificationBell />
            </div>
            <CurrencyToggle />
            <Link
              href={`/login`}
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-semibold
                border border-foreground/10 text-foreground/70
                hover:border-purple dark:hover:border-gold
                transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href={`/register`}
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-bold
                bg-purple text-white dark:bg-gold dark:text-[#1c1714]
                shadow-md transition-all"
            >
              {t("bookNow")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
