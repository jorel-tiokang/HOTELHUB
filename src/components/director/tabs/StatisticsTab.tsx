"use client";

import { formatCompactPrice } from "@/utils/currency";
import type { Chambre } from "@/types/chambre";
import type { CurrencyCode } from "@/store/currencyStore";

interface StatisticsTabProps {
  t: (key: string) => string;
  chambres: Chambre[];
  tauxOccupation: number;
  statReservations: number;
  statRecettes: number;
  currency: CurrencyCode;
  locale: string;
}

export default function StatisticsTab({
  t,
  chambres,
  tauxOccupation,
  statReservations,
  statRecettes,
  currency,
  locale,
}: StatisticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("statistics.bookingsThisMonth")}
          </h3>
          <p className="text-4xl font-black text-gold" style={{ fontFamily: "var(--font-playfair)" }}>
            {statReservations}
          </p>
        </div>
        <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("statistics.revenueThisMonth")}
          </h3>
          <p className="text-4xl font-black text-gold" style={{ fontFamily: "var(--font-playfair)" }}>
            {formatCompactPrice(statRecettes, currency, locale)}
          </p>
        </div>
      </div>

      <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("statistics.occupancyRate")}
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex-1 h-4 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${tauxOccupation}%` }} />
          </div>
          <span className="text-3xl font-black text-gold" style={{ fontFamily: "var(--font-playfair)" }}>
            {tauxOccupation}%
          </span>
        </div>
      </div>

      <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("statistics.roomAvailability")}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gold/10 border border-gold/20 rounded-xl p-6 text-center">
            <p className="text-4xl font-black text-gold" style={{ fontFamily: "var(--font-playfair)" }}>
              {chambres.filter((c) => c.statut === "DISPONIBLE").length}
            </p>
            <p className="text-gold/70 text-sm mt-2">{t("statistics.available")}</p>
          </div>
          <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
            <p className="text-4xl font-black text-red-400" style={{ fontFamily: "var(--font-playfair)" }}>
              {chambres.filter((c) => c.statut === "INDISPONIBLE").length}
            </p>
            <p className="text-red-400/70 text-sm mt-2">{t("statistics.occupied")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
