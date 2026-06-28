"use client";

import { useState, useCallback } from "react";
import React from "react";
import { useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  ImageOff,
  Sprout,
  Waves,
  Martini,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Car,
  Dumbbell,
} from "lucide-react";
import type { Chambre } from "../../types/chambre";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

/** Maps common keyword fragments to a lucide icon */
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

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ImageCarouselProps {
  images: string[];
  roomLabel: string;
}

function ImageCarousel({ images, roomLabel }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIndex((i) => (i + 1) % images.length);
    },
    [images.length],
  );

  if (images.length === 0) {
    return (
      <div className="w-full h-44 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-2 text-white/30">
        <ImageOff className="w-8 h-8" />
        <span className="text-xs">Aucune photo</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden group/carousel select-none">
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={`${roomLabel} — photo ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Nav buttons — visible on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
              bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100
              hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
              bg-black/50 text-white opacity-0 group-hover/carousel:opacity-100
              hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Photo ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === index
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image counter badge */}
      {images.length > 1 && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white/80 text-xs backdrop-blur-sm">
          {index + 1}/{images.length}
        </span>
      )}
    </div>
  );
}

// ─── RoomCard ─────────────────────────────────────────────────────────────────

export interface RoomCardProps {
  room: Chambre;
  onEdit?: (room: Chambre) => void;
  onDelete?: (id: string) => void;
  onToggleStatut?: (id: string) => void;
}

export default function RoomCard({
  room,
  onEdit,
  onDelete,
  onToggleStatut,
}: RoomCardProps) {
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const floorNumber = Math.floor(room.numero / 100);

  return (
    <article
      className="bg-charcoal hover:-translate-y-2 rounded-2xl overflow-hidden shadow-lg
        hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group flex flex-col"
    >
      {/* ── Image carousel ── */}
      <div className="p-3 pb-0">
        <ImageCarousel
          images={room.images}
          roomLabel={`Chambre ${room.numero}`}
        />
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4
              className="text-xl font-bold text-foreground leading-tight truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Chambre {room.numero}
            </h4>
            <p className="text-foreground/50 text-sm">
              {room.type}
              {floorNumber > 0 && ` — Étage ${floorNumber}`}
              {room.capacite > 0 && ` · ${room.capacite} pers.`}
            </p>
          </div>

          {/* Status badge — clickable if handler provided */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggleStatut?.(room.id)}
              disabled={!onToggleStatut}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                ${STATUT_CHAMBRE_STYLE[room.statut]}
                ${onToggleStatut ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${STATUT_DOT[room.statut]}`}
              />
              {STATUT_LABEL[room.statut]}
            </button>
            {room.actif === false && (
              <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                Inactif
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Equipements */}
        {room.equipements.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {room.equipements.map((eq) => {
              const Icon = getEquipementIcon(eq);
              return (
                <span
                  key={eq}
                  className="inline-flex items-center gap-1 px-2 py-1
                    bg-foreground/5 text-foreground/60 text-xs rounded-lg border border-foreground/5"
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {eq}
                </span>
              );
            })}
          </div>
        )}

        {/* Footer: price + actions */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gold/10">
          <p
            className="text-gold font-bold text-lg leading-none"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {formatPrice(room.prixParNuit, currency, locale)}
            <span className="text-foreground/40 text-sm font-normal ml-1">/nuit</span>
          </p>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(room)}
                aria-label="Modifier la chambre"
                className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60
                  hover:text-foreground transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(room.id)}
                aria-label="Supprimer la chambre"
                className="p-2 rounded-lg bg-foreground/5 hover:bg-red-500/20
                  text-foreground/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
