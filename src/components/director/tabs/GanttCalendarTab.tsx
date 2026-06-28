"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  X,
  BedDouble,
} from "lucide-react";
import type { ClientReservation } from "@/store/reservationStore";
import type { Chambre } from "@/types/chambre";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function parseDate(str: string) {
  return new Date(str + "T00:00:00");
}

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Booking color palette — high contrast on both themes
const BOOKING_COLORS = [
  { bg: "bg-purple/80",       border: "border-purple",       text: "text-white"       },
  { bg: "bg-blue-500/80",     border: "border-blue-400",     text: "text-white"       },
  { bg: "bg-emerald-500/80",  border: "border-emerald-400",  text: "text-white"       },
  { bg: "bg-amber-500/80",    border: "border-amber-400",    text: "text-foreground"  },
  { bg: "bg-rose-500/80",     border: "border-rose-400",     text: "text-white"       },
  { bg: "bg-cyan-500/80",     border: "border-cyan-400",     text: "text-foreground"  },
  { bg: "bg-violet-500/80",   border: "border-violet-400",   text: "text-white"       },
  { bg: "bg-orange-500/80",   border: "border-orange-400",   text: "text-white"       },
];

function getColorForBooking(bookingId: string) {
  let hash = 0;
  for (let i = 0; i < bookingId.length; i++) {
    hash = bookingId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BOOKING_COLORS[Math.abs(hash) % BOOKING_COLORS.length];
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface GanttCalendarTabProps {
  t: (key: string) => string;
  chambres: Chambre[];
  bookings: ClientReservation[];
}

interface BookingDetailModal {
  booking: ClientReservation;
  color: (typeof BOOKING_COLORS)[0];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GanttCalendarTab({
  t,
  chambres,
  bookings,
}: GanttCalendarTabProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailModal | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Bookings visible this month, per room
  const bookingsByRoom = useMemo(() => {
    const map: Record<string, ClientReservation[]> = {};
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth, daysInMonth);
    for (const b of bookings) {
      if (b.statut === "ANNULEE") continue;
      const start = parseDate(b.jourDebut);
      const end = parseDate(b.jourFin);
      if (end < firstDay || start > lastDay) continue;
      if (!map[b.chambreId]) map[b.chambreId] = [];
      map[b.chambreId].push(b);
    }
    return map;
  }, [bookings, currentYear, currentMonth, daysInMonth]);

  const todayDayIndex =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth
      ? today.getDate() - 1
      : -1;

  const totalBookingsThisMonth = Object.values(bookingsByRoom).flat().length;
  const occupiedRooms = Object.keys(bookingsByRoom).length;
  const occupancyRate = chambres.length > 0
    ? Math.round((occupiedRooms / chambres.length) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("nav.calendar") || "Calendrier"}
          </h2>
          <p className="text-foreground/50 text-sm capitalize">{monthLabel}</p>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all border border-border"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-foreground font-semibold text-sm w-36 text-center capitalize">
            {monthLabel}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-all border border-border"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("gantt.totalBookings") || "Réservations ce mois", value: totalBookingsThisMonth, accent: "text-purple dark:text-purple" },
          { label: t("gantt.occupiedRooms") || "Chambres occupées",    value: `${occupiedRooms} / ${chambres.length}`,  accent: "text-gold" },
          { label: t("gantt.occupancyRate") || "Taux d'occupation",    value: `${occupancyRate}%`,                       accent: "text-emerald-500 dark:text-emerald-400" },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm"
          >
            <p className={`text-2xl font-black ${accent}`} style={{ fontFamily: "var(--font-playfair)" }}>
              {value}
            </p>
            <p className="text-foreground/50 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Gantt Grid ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div
            className="grid min-w-max"
            style={{ gridTemplateColumns: `180px repeat(${daysInMonth}, minmax(32px, 1fr))` }}
          >
            {/* Corner */}
            <div className="px-4 py-3 bg-foreground/5 border-b border-r border-border flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-gold shrink-0" />
              <span className="text-foreground/50 text-xs font-semibold uppercase tracking-wider">
                Chambre
              </span>
            </div>

            {/* Day headers */}
            {days.map((day) => {
              const isToday = day - 1 === todayDayIndex;
              const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 ||
                                new Date(currentYear, currentMonth, day).getDay() === 6;
              return (
                <div
                  key={day}
                  className={`py-3 border-b border-r border-border text-center text-xs font-semibold transition-colors
                    ${isToday
                      ? "bg-purple/20 text-purple dark:text-purple border-purple/30 font-bold"
                      : isWeekend
                        ? "bg-foreground/[0.03] text-foreground/30"
                        : "bg-foreground/[0.02] text-foreground/40"
                    }`}
                >
                  {day}
                </div>
              );
            })}

            {/* ── Room rows ── */}
            {chambres.length === 0 ? (
              <div className="col-span-full py-16 text-center text-foreground/40 text-sm">
                {t("gantt.noRooms") || "Aucune chambre configurée"}
              </div>
            ) : (
              chambres.map((chambre, roomIdx) => {
                const roomBookings = bookingsByRoom[chambre.id] ?? [];
                const isEven = roomIdx % 2 === 0;

                return (
                  <div key={chambre.id} className="contents">

                    {/* Room label cell */}
                    <div
                      className={`px-4 py-3 border-b border-r border-border flex items-center gap-2
                        ${isEven ? "bg-foreground/[0.02]" : "bg-transparent"}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        roomBookings.length > 0 ? "bg-emerald-500 dark:bg-emerald-400" : "bg-foreground/20"
                      }`} />
                      <div className="min-w-0">
                        <p className="text-foreground text-xs font-semibold truncate">
                          {(chambre as any).type || "Chambre"} #{(chambre as any).numero || chambre.id}
                        </p>
                        <p className="text-foreground/40 text-[10px]">
                          {(chambre as any).statut || ""}
                        </p>
                      </div>
                    </div>

                    {/* Day cells */}
                    {days.map((day) => {
                      const isToday = day - 1 === todayDayIndex;
                      const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 ||
                                        new Date(currentYear, currentMonth, day).getDay() === 6;

                      const coveringBooking = roomBookings.find((b) => {
                        const cell = new Date(currentYear, currentMonth, day);
                        return cell >= parseDate(b.jourDebut) && cell < parseDate(b.jourFin);
                      });

                      return (
                        <div
                          key={`cell-${chambre.id}-${day}`}
                          className={`relative py-3 border-b border-r border-border
                            ${isToday
                              ? "bg-purple/[0.07]"
                              : isWeekend
                                ? "bg-foreground/[0.01]"
                                : isEven
                                  ? "bg-foreground/[0.02]"
                                  : ""
                            }`}
                          title={coveringBooking
                            ? `${coveringBooking.clientName || "Client"} — ${coveringBooking.jourDebut} → ${coveringBooking.jourFin}`
                            : undefined}
                        >
                          {coveringBooking && (() => {
                            const bookingStart = parseDate(coveringBooking.jourDebut);
                            const cellDay = new Date(currentYear, currentMonth, day);
                            const isFirstDay =
                              bookingStart.getFullYear() === cellDay.getFullYear() &&
                              bookingStart.getMonth() === cellDay.getMonth() &&
                              bookingStart.getDate() === cellDay.getDate();
                            const color = getColorForBooking(coveringBooking.id);

                            if (!isFirstDay) {
                              return (
                                <div
                                  className={`absolute inset-y-1.5 inset-x-0 ${color.bg} opacity-80 cursor-pointer`}
                                  onClick={() => setSelectedBooking({ booking: coveringBooking, color })}
                                />
                              );
                            }

                            return (
                              <button
                                onClick={() => setSelectedBooking({ booking: coveringBooking, color })}
                                className={`absolute inset-y-1.5 left-0 right-0 rounded-l-md ${color.bg} border-l-2 ${color.border}
                                  flex items-center gap-1 px-1.5 overflow-hidden
                                  hover:brightness-110 transition-all z-10 cursor-pointer`}
                              >
                                <User className="w-2.5 h-2.5 shrink-0 text-white" />
                                <span className="text-[9px] font-bold truncate text-white whitespace-nowrap">
                                  {(coveringBooking.clientName || "Client").split(" ")[0]}
                                </span>
                              </button>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>{t("gantt.legendOccupied") || "Chambre avec réservation active"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-foreground/20" />
          <span>{t("gantt.legendFree") || "Chambre libre"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-purple/20" />
          <span>{t("gantt.legendToday") || "Aujourd'hui"}</span>
        </div>
      </div>

      {/* ── Booking Detail Modal ── */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selectedBooking.color.bg} border ${selectedBooking.color.border} flex items-center justify-center shrink-0`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-foreground font-bold text-base"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {selectedBooking.booking.clientName || "Client"}
                  </h3>
                  <p className="text-foreground/40 text-xs">
                    {t("gantt.bookingRef") || "Réf."} {selectedBooking.booking.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info rows */}
            <div className="space-y-1">
              {[
                { label: t("gantt.modalRoom")    || "Chambre",    value: `${selectedBooking.booking.chambreType} #${selectedBooking.booking.chambreNumero}` },
                { label: t("gantt.modalCheckIn") || "Arrivée",    value: formatDate(parseDate(selectedBooking.booking.jourDebut)) },
                { label: t("gantt.modalCheckOut")|| "Départ",     value: formatDate(parseDate(selectedBooking.booking.jourFin)) },
                { label: t("gantt.modalGuests")  || "Voyageurs",  value: `${selectedBooking.booking.nombrePersonnes} personne(s)` },
                { label: t("gantt.modalStatus")  || "Statut",     value: selectedBooking.booking.statut },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-2.5 border-b border-border"
                >
                  <span className="text-foreground/50 text-xs">{label}</span>
                  <span className="text-foreground text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border text-foreground/70 hover:text-foreground text-sm font-semibold transition-all"
            >
              {t("gantt.close") || "Fermer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
