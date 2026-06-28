"use client";

import { BedDouble, CalendarCheck, BarChart3, Star, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Chambre } from "@/types/chambre";
import type { BackendReviewDTO } from "@/services/api.types";
import type { ClientReservation } from "@/store/reservationStore";
import type { CurrencyCode } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

const STATUT_RES_STYLE: Record<string, string> = {
  IMPAYEE: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  PAYEE: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  CONFIRMEE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  EN_ATTENTE: "bg-gold/20 text-gold border border-gold/30",
  ANNULEE: "bg-red-500/20 text-red-400 border border-red-500/30",
  TERMINEE: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
};

interface OverviewTabProps {
  t: (key: string) => string;
  chambres: Chambre[];
  bookings: ClientReservation[];
  filteredBookings: ClientReservation[];
  directorReviews: BackendReviewDTO[];
  weeklyOccupancyData: { day: string; occupancy: number }[];
  tauxOccupation: number;
  setActiveTab: (tab: string) => void;
  currency: CurrencyCode;
  locale: string;
}

export default function OverviewTab({
  t,
  chambres,
  bookings,
  filteredBookings,
  directorReviews,
  weeklyOccupancyData,
  tauxOccupation,
  setActiveTab,
  currency,
  locale,
}: OverviewTabProps) {
  const kpis = [
    { label: t("kpi.totalRooms"), value: chambres.length, trend: "+2", up: true, icon: BedDouble },
    { label: t("kpi.activeBookings"), value: bookings.filter((r) => r.statut === "CONFIRMEE").length, trend: "+5", up: true, icon: CalendarCheck },
    { label: t("kpi.occupancyRate"), value: `${tauxOccupation}%`, trend: "+12%", up: true, icon: BarChart3 },
    { label: t("kpi.averageRating"), value: "4.8", trend: "+0.2", up: true, icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-charcoal rounded-2xl p-6 shadow-md animateCardBoxHover group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-foreground/10">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <p className="text-3xl font-black text-gold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                {kpi.value}
              </p>
              <p className="text-foreground/50 text-sm">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-charcoal rounded-2xl p-6 shadow-lg animateCardBoxHover">
          <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("overview.weeklyOccupancy")}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-foreground)" strokeOpacity={0.1} />
                <XAxis dataKey="day" stroke="var(--color-foreground)" strokeOpacity={0.5} fontSize={12} />
                <YAxis stroke="var(--color-foreground)" strokeOpacity={0.5} fontSize={12} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: "rgba(212, 175, 55, 0.15)" }}
                  contentStyle={{ backgroundColor: "var(--color-charcoal)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "12px", color: "var(--color-foreground)" }}
                  formatter={(value: any) => [`${value}%`, "Occupation"]}
                />
                <Bar dataKey="occupancy" fill="rgb(212,175,55)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-charcoal rounded-2xl p-6 shadow-lg animateCardBoxHover">
          <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            {t("overview.latestReviews")}
          </h3>
          <div className="space-y-4">
            {directorReviews.length === 0 ? (
              <p className="text-foreground/40 text-sm text-center py-4">Aucun avis récent</p>
            ) : (
              directorReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="pb-4 border-b border-gold/10 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-gold fill-gold" : "text-foreground/20"}`} />
                      ))}
                    </div>
                    <span className="text-foreground/40 text-xs">{review.client_full_name}</span>
                  </div>
                  {review.comment && (
                    <p className="text-foreground/70 text-sm line-clamp-2">&quot;{review.comment}&quot;</p>
                  )}
                </div>
              ))
            )}
          </div>
          <button onClick={() => setActiveTab("reviews")} className="mt-4 w-full py-2 text-sm text-gold hover:text-gold/80 flex items-center justify-center gap-1 transition-colors">
            {t("overview.seeMore")} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-charcoal rounded-2xl p-4 md:p-6 shadow-lg overflow-x-auto">
        <h3 className="text-lg font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("overview.recentBookings")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">Client</th>
                <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.roomType")}</th>
                <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.arrival")}</th>
                <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.departure")}</th>
                <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="py-4 px-4 text-foreground font-medium">Client ({booking.id.slice(-4)})</td>
                  <td className="py-4 px-4 text-foreground/70">{booking.chambreType}</td>
                  <td className="py-4 px-4 text-foreground/70">{booking.jourDebut}</td>
                  <td className="py-4 px-4 text-foreground/70">{booking.jourFin}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_RES_STYLE[booking.statut]}`}>
                      {t(`status.${booking.statut}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setActiveTab("bookings")} className="mt-4 w-full py-2 text-sm text-gold hover:text-gold/80 flex items-center justify-center gap-1 transition-colors">
          {t("overview.seeMore")} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
