"use client";
import { useTranslations } from "next-intl";
import React from "react";
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
  Star,
} from "lucide-react";

// ─── Helpers (Imported from RoomCard logic) ───────────────────────────────────

const STATUT_CHAMBRE_STYLE: Record<string, string> = {
  DISPONIBLE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  INDISPONIBLE: "bg-red-500/20 text-red-400 border border-red-400/30",
};

const STATUT_DOT: Record<string, string> = {
  DISPONIBLE: "bg-emerald-400",
  INDISPONIBLE: "bg-red-400",
};

const STATUT_LABEL: Record<string, string> = {
  DISPONIBLE: "Disponible",
  INDISPONIBLE: "Occupée",
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

import { getAllRooms } from "@/mocks/hotelsData";

// ─── Component ────────────────────────────────────────────────────────────────

export default function HotelScroll() {
    const t = useTranslations("text");
    const roomsData = getAllRooms();
    const ALL_ROOMS = [...roomsData, ...roomsData];

  return (
    <section className="py-12 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span className="inline-block dark:bg-[rgb(150,130,120,.4)] text-dark-white bg-purple/20 text-[1.2rem] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest backdrop-blur-sm">
          ✦ {t("1")}
        </span>
        <h2 className="text-[17px] font-bold text-dark-white drop-shadow-md">
          {t("2")}
        </h2>
      </div>

      <div className="relative w-full mask-gradient overflow-hidden pb-8">
        <div className="animate-scroll flex gap-6 px-6">
          {ALL_ROOMS.map((room, index) => {
            const statutKey = room.statut;

            return (
              <article
                key={index}
                className="w-[320px] shrink-0 bg-charcoal hover:-translate-y-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group flex flex-col"
              >
                {/* ── Static Image Section (Replaces ImageCarousel) ── */}
                <div className="p-3 pb-0">
                  <div className="relative w-full h-44 rounded-xl overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.type}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* ── Card body (Mirrors RoomCard.tsx) ── */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4
                        className="text-xl font-bold text-dark-white leading-tight truncate"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {room.type}
                      </h4>
                      <p className="text-dark-white/50 text-sm truncate">
                        {room.hotelName} · {room.city}
                      </p>
                      <p className="text-dark-white/40 text-xs mt-0.5">
                        N°{room.numero} · {room.capacite} pers.
                      </p>
                    </div>

                    {/* Status badge */}
                    <div
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUT_CHAMBRE_STYLE[statutKey]}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${STATUT_DOT[statutKey]}`}
                      />
                      {STATUT_LABEL[statutKey]}
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
                              bg-dark-white/5 text-dark-white/60 text-xs rounded-lg border border-dark-white/5"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            {eq}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer: Price + Rating */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gold/10">
                    <p
                      className="text-gold font-bold text-lg leading-none"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {room.prixParNuit.toLocaleString("fr-FR")}
                      <span className="text-white/40 text-sm font-normal ml-1">
                        FCFA/nuit
                      </span>
                    </p>

                    {/* Replaced Admin Action buttons with Star Rating for public view */}
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-white font-semibold text-sm">
                        {room.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
