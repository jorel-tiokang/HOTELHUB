"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { Room } from "@/services/hotel";
import React from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";
import {
  Wifi,
  Tv,
  Wind,
  Coffee,
  Car,
  Dumbbell,
  Waves,
  Sprout,
  Martini,
} from "lucide-react";

const STATUT_CHAMBRE_STYLE: Record<string, string> = {
  DISPONIBLE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  INDISPONIBLE: "bg-red-500/20 text-red-400 border border-red-400/30",
};

const STATUT_DOT: Record<string, string> = {
  DISPONIBLE: "bg-emerald-400",
  INDISPONIBLE: "bg-red-400",
};

const EQUIPEMENT_ICON: Record<string, React.ElementType> = {
  wifi: Wifi,
  tv: Tv,
  clim: Wind,
  climatisation: Wind,
  café: Coffee,
  cafe: Coffee,
  parking: Car,
  gym: Dumbbell,
  sport: Dumbbell,
  piscine: Waves,
  spa: Sprout,
  bar: Martini,
};

function getEquipementIcon(eq: string): React.ElementType | null {
  const lower = eq.toLowerCase();
  for (const [key, Icon] of Object.entries(EQUIPEMENT_ICON)) {
    if (lower.includes(key)) return Icon;
  }
  return null;
}

export default function BookableRoomCard({
  room,
  hotelId,
}: {
  room: Room;
  hotelId: string;
}) {
  const t = useTranslations("hotelsPage.detail");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const available = room.statut === "DISPONIBLE";
  const statutKey = available ? "DISPONIBLE" : "INDISPONIBLE";

  return (
    <article
      className="w-full bg-charcoal hover:-translate-y-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group flex flex-col"
    >
      {/* ── Static Image Section ── */}
      <div className="p-3 pb-0">
        <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.type}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          {!available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 bg-black/50 rounded-full border border-white/10">
                {t("bookNow") === "Réserver" ? "Indisponible" : "Unavailable"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4
              className="text-xl font-bold text-white leading-tight truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {room.type} — N°{room.numero}
            </h4>
            <p className="text-white/40 text-xs mt-1">
              {room.capacite} {t("capacity")}
            </p>
          </div>

          {/* Status badge */}
          <div
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUT_CHAMBRE_STYLE[statutKey]}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${STATUT_DOT[statutKey]}`}
            />
            {available ? (t("bookNow") === "Réserver" ? "Disponible" : "Available") : (t("bookNow") === "Réserver" ? "Occupée" : "Occupied")}
          </div>
        </div>

        {/* Equipements (Tags) */}
        {room.equipements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {room.equipements.map((eq) => {
              const Icon = getEquipementIcon(eq);
              return (
                <span
                  key={eq}
                  className="inline-flex items-center gap-1 px-2 py-1
                    bg-white/5 text-white/60 text-xs rounded-lg border border-white/5"
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {eq}
                </span>
              );
            })}
          </div>
        )}

        {/* Footer: Price + Action */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gold/10">
          <p
            className="text-gold font-bold text-lg leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {formatPrice(room.prixParNuit, currency, locale)}
            <span className="text-white/40 text-xs font-normal ml-1">
              {t("perNight")}
            </span>
          </p>

          <Link
            href={`/${locale}/hotels/${hotelId}/rooms/${room.id}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${available
                ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] hover:opacity-90 shadow-lg shadow-gold/20"
                : "bg-white/10 text-white/40 cursor-not-allowed pointer-events-none"
              }`}
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </article>
  );
}