"use client";

import { useTranslations } from "next-intl";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";
import DatePicker from "./DatePicker";

export default function HeroSection() {
  const t = useTranslations("hero");
  const ts = useTranslations("stats");

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("");

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* ── Background image + overlays ── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[url('/landscape.jpg')]
            bg-cover bg-center bg-fixed"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b
          from-black/60 via-black/30 to-black/70" />
        {/* Light mode warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br
          from-[#f9f4ef]/10 via-transparent to-purple/10
          dark:from-transparent dark:to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center
        px-4 pt-32 pb-16 max-w-5xl mx-auto w-full gap-8">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5
          rounded-full border border-white/25 bg-white/10 backdrop-blur-sm
          text-white text-xs font-semibold uppercase tracking-widest">
          <span className="text-4xl w-2 h-2 rounded-full bg-gold animate-pulse" />
          {t("badge")}
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("titleLine1")}{" "}
            <span className="text-gold dark:text-gold italic">
              {t("titleLine2")}
            </span>
          </h1>
          <p
            className="text-3xl sm:text-4xl font-bold text-white/80"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("titleAccent")}
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>

        {/* ── Search Form ── */}
        <div className="w-full max-w-5xl relative z-20">
          <div className="bg-white/10 dark:bg-[#1c1714]/60 backdrop-blur-xl
            border border-white/20 dark:border-gold/10
            rounded-2xl p-2 shadow-2xl shadow-black/30">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">

              {/* Destination */}
              <div className="flex items-center gap-3 px-4 py-3
                bg-white/10 dark:bg-white/5 rounded-xl
                hover:bg-white/20 dark:hover:bg-white/10 transition-colors group">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
                    {t("search.locationLabel")}
                  </span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t("search.locationPlaceholder")}
                    className="bg-transparent text-white text-sm font-medium
                      placeholder-white/40 outline-none w-full"
                  />
                </div>
              </div>

              {/* Check-in */}
              {/* Check-in */}
      <DatePicker 
        label={t("search.checkInLabel")}
        selectedDate={checkIn}
        onDateChange={setCheckIn}
      />

      {/* Check-out */}
      <DatePicker 
        label={t("search.checkOutLabel")}
        selectedDate={checkOut}
        onDateChange={setCheckOut}
      />

              {/* Guests + Search button */}
              <div className="flex gap-1">
                <div className="flex relative items-center gap-3 px-4 py-3
                  bg-white/10 dark:bg-white/5 rounded-xl flex-1
                  hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                  <Users className="w-4 h-4 text-gold shrink-0" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
                      {t("search.guestsLabel")}
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="1"
                      className="bg-transparent text-white text-sm font-medium
                        placeholder-white/40 outline-none w-full"
                    />
                  </div>
                </div>

                <button
                  className="px-5 py-3 rounded-xl
                    bg-purple dark:bg-gold
                    text-white dark:text-[#1c1714]
                    font-bold text-sm shrink-0
                    shadow-lg shadow-purple/30 dark:shadow-gold/30
                    hover:bg-purple/90 dark:hover:bg-gold/90
                    transition-all duration-200 flex items-center gap-2"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="w-full max-w-3xl">
          <div className="bg-white/10 dark:bg-[#1c1714]/60 backdrop-blur-md
            rounded-2xl border border-white/15 dark:border-gold/10
            p-6 flex flex-wrap justify-around gap-y-6 gap-x-4">

            {[
              { value: "100+", label: ts("hotels") },
              { value: "36", label: ts("regions") },
              { value: "4.2 ★", label: ts("rating"), gold: true },
              { value: "24/7", label: ts("available") },
            ].map(({ value, label, gold }) => (
              <div key={label} className="flex flex-col items-center min-w-[100px]">
                <span
                  className={`text-3xl font-black mb-1 tracking-tight
                    ${gold ? "text-gold" : "text-white"}`}
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {value}
                </span>
                <span className="text-white/50 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-center">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-32
        bg-gradient-to-t from-background to-transparent -z-0 pointer-events-none" />
    </section>
  );
}