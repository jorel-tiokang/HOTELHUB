"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar, Users, ChevronRight, MapPin } from "lucide-react";
import type { ClientReservation, StatutReservationClient } from "@/mocks/clientBookings";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

// ── Status colour mapping ────────────────────────────────────────────────────
const STATUT_STYLES: Record<StatutReservationClient, string> = {
  IMPAYEE:   "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  PAYEE:     "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  CONFIRMEE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  ANNULEE:   "bg-red-500/20 text-red-400 border border-red-500/30",
  TERMINEE:  "bg-foreground/10 text-foreground/50 border border-foreground/15",
};

interface BookingCardProps {
  booking: ClientReservation;
  onClick?: () => void;
}

/** Compute the number of nights between two ISO date strings */
function computeNights(debut: string, fin: string): number {
  return Math.round(
    (new Date(fin).getTime() - new Date(debut).getTime()) / (1000 * 60 * 60 * 24),
  );
}

/** Format ISO date to short locale string, e.g. "10 juil. 2026" */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const t = useTranslations("clientDashboard");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const nights = computeNights(booking.jourDebut, booking.jourFin);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={`
        group relative flex flex-col sm:flex-row gap-0
        bg-charcoal rounded-2xl border border-foreground/10
        overflow-hidden shadow-lg
        ${onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-gold/15 hover:border-gold/25 hover:shadow-xl" : ""}
        transition-all duration-300
      `}
    >
      {/* Hotel image — left strip on desktop */}
      <div className="relative sm:w-40 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
        <img
          src={booking.hotelImage}
          alt={booking.hotelNom}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 sm:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 sm:hidden" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between gap-3 p-5 flex-1 min-w-0">
        {/* Top row: hotel + status badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-foreground font-bold text-base leading-tight truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {booking.hotelNom}
            </p>
            <p className="flex items-center gap-1 text-foreground/50 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              {booking.hotelVille} &mdash; {booking.chambreType} #{booking.chambreNumero}
            </p>
          </div>
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUT_STYLES[booking.statut]}`}
          >
            {t(`status.${booking.statut}`)}
          </span>
        </div>

        {/* Dates + guests row */}
        <div className="flex flex-wrap items-center gap-4 text-foreground/60 text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold/70" />
            {fmtDate(booking.jourDebut)} → {fmtDate(booking.jourFin)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gold/70" />
            {booking.nombrePersonnes} {t("upcoming.guests")}
          </span>
          <span className="text-foreground/40">
            {nights} {t("upcoming.nights")}
          </span>
        </div>

        {/* Bottom row: price + CTA arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-foreground/8">
          <p className="text-foreground/50 text-xs">
            {t("detail.total")}{" "}
            <span className="text-gold font-bold text-base ml-1">
              {formatPrice(booking.montantTotal, currency, locale)}
            </span>
          </p>
          {onClick && (
            <span className="flex items-center gap-1 text-xs text-foreground/40 group-hover:text-gold transition-colors duration-200">
              {t("upcoming.viewDetails")}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
