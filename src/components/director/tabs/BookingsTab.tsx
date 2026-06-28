"use client";

import { useState } from "react";
import { Check, X, Eye, Crown } from "lucide-react";
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

interface BookingsTabProps {
  t: (key: string) => string;
  bookings: ClientReservation[];
  currency: CurrencyCode;
  locale: string;
  onAction: (bookingRef: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => Promise<void>;
}

export default function BookingsTab({ t, bookings, currency, locale, onAction }: BookingsTabProps) {
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filteredBookings =
    bookingFilter === "all" ? bookings : bookings.filter((b) => b.statut === bookingFilter.toUpperCase());

  const selectedBookingData = selectedBooking ? bookings.find((b) => b.id === selectedBooking) : null;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "EN_ATTENTE", "PAYEE", "CONFIRMEE", "TERMINEE", "ANNULEE"].map((f) => (
          <button
            key={f}
            onClick={() => setBookingFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              bookingFilter === f ? "bg-purple text-white" : "bg-charcoal text-foreground/60 hover:text-foreground border border-foreground/10"
            }`}
          >
            {f === "all" ? "Tous" : t(`status.${f}`)}
          </button>
        ))}
      </div>

      <div className="bg-charcoal rounded-2xl p-4 md:p-6 shadow-lg overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.id")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.guest")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.room")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.dates")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.price")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.status")}</th>
              <th className="text-left py-3 px-4 text-foreground/50 text-xs uppercase tracking-wider font-semibold">{t("bookings.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className={`border-b border-foreground/5 hover:bg-foreground/5 transition-colors ${
                  booking.chambreId === "PRIVATISATION" ? "bg-gold/[0.04]" : ""
                }`}
              >
                <td className="py-4 px-4 text-foreground/50 text-sm">{booking.id}</td>
                <td className="py-4 px-4 text-foreground font-medium">{booking.clientName || `Client (${booking.id.slice(-4)})`}</td>
                <td className="py-4 px-4 text-foreground/70">
                  {booking.chambreId === "PRIVATISATION" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
                      <Crown className="w-3 h-3" />
                      Privatisation
                    </span>
                  ) : (
                    booking.chambreType
                  )}
                </td>
                <td className="py-4 px-4 text-foreground/70 text-sm">{booking.jourDebut} - {booking.jourFin}</td>
                <td className="py-4 px-4 text-gold font-semibold">
                  {booking.montantTotal != null ? formatPrice(booking.montantTotal, currency, locale) : "—"}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_RES_STYLE[booking.statut]}`}>
                    {t(`status.${booking.statut}`)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {(booking.statut === "PAYEE" || booking.statut === "EN_ATTENTE") ? (
                      <>
                        <button title="Accepter" onClick={() => onAction(booking.id, "CONFIRMED")} className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button title="Rejeter" onClick={() => onAction(booking.id, "CANCELLED")} className="p-2 rounded-lg border border-red-400/30 hover:bg-red-500/20 text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : booking.statut === "IMPAYEE" ? (
                      <>
                        <button title="Rejeter" onClick={() => onAction(booking.id, "CANCELLED")} className="p-2 rounded-lg border border-red-400/30 hover:bg-red-500/20 text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                        <button title="Voir" onClick={() => setSelectedBooking(booking.id)} className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    ) : booking.statut === "CONFIRMEE" ? (
                      <>
                        <button title="Terminer" onClick={() => onAction(booking.id, "COMPLETED")} className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors text-xs font-semibold px-3">
                          Terminé
                        </button>
                        <button title="Voir" onClick={() => setSelectedBooking(booking.id)} className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setSelectedBooking(booking.id)} className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-charcoal rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("bookings.modal.title")}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">{t("bookings.table.guest")}</p>
                <p className="text-foreground font-semibold">Client ({selectedBookingData?.id?.slice(-4)})</p>
              </div>
              <div>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">{t("bookings.modal.email")}</p>
                <p className="text-foreground/70">client.{selectedBookingData?.id?.slice(-4).toLowerCase()}@email.com</p>
              </div>
              <div>
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">{t("bookings.modal.phone")}</p>
                <p className="text-foreground/70">+237 699 123 456</p>
              </div>
              <div className="pt-4 border-t border-gold/10">
                <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">{t("bookings.modal.transaction")}</p>
                <p className="text-gold font-semibold">
                  {selectedBookingData?.montantTotal != null ? formatPrice(selectedBookingData.montantTotal, currency, locale) : "—"}{" "}
                  — {t(`status.${selectedBookingData?.statut ?? "CONFIRMEE"}`)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-xl transition-colors"
            >
              {t("bookings.modal.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
