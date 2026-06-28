"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  CalendarDays,
  Moon,
  Clock3,
  Hotel,
  LogOut,
  ChevronDown,
  ChevronUp,
  Download,
  Headphones,
  Map,
  Star,
  User,
  X,
  Phone,
  Mail,
  MapPin,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useClientDashboardStore } from "@/store/clientDashboardStore";
import { useReservationStore } from "@/store/reservationStore";
import { useMessagesStore } from "@/store/messagesStore";
import type { ClientReservation, StatutReservationClient } from "@/mocks/clientBookings";
import Header from "@/src/components/Header";
import { Footer } from "@/src/components/footer";
import BookingCard from "@/src/components/BookingCard";
import StatCard from "@/src/components/StatCard";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";
import ReviewModal from "@/src/components/ReviewModal";
import { hasReviewedBooking, getReviewsForClient } from "@/src/services/reviewService";
import type { BackendReviewDTO } from "@/services/api.types";
import { useHotelsStore } from "@/store/hotelsStore";
import MessagesTab from "@/src/components/shared/MessagesTab";

// ── Status colour map ────────────────────────────────────────────────────────
const STATUT_STYLES: Record<StatutReservationClient, string> = {
  IMPAYEE:   "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  PAYEE:     "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  CONFIRMEE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  ANNULEE:   "bg-red-500/20 text-red-400 border border-red-500/30",
  TERMINEE:  "bg-foreground/10 text-foreground/50 border border-foreground/15",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function nightsBetween(debut: string, fin: string): number {
  return Math.round(
    (new Date(fin).getTime() - new Date(debut).getTime()) / (1000 * 60 * 60 * 24),
  );
}

// ── Dynamic Helpers ──────────────────────────────────────────────────────────
const today = new Date();
today.setHours(0, 0, 0, 0);

function getUpcomingBookings(bookings: ClientReservation[]) {
  return bookings.filter((b) => {
    if (b.statut === "ANNULEE" || b.statut === "TERMINEE") return false;
    return new Date(b.jourFin) >= today;
  });
}

function getPastBookings(bookings: ClientReservation[]) {
  return bookings.filter((b) => {
    if (b.statut === "TERMINEE" || b.statut === "ANNULEE") return true;
    return new Date(b.jourFin) < today;
  });
}

function daysUntilNextBooking(bookings: ClientReservation[]): number | null {
  const upcoming = getUpcomingBookings(bookings).sort(
    (a, b) => new Date(a.jourDebut).getTime() - new Date(b.jourDebut).getTime()
  );
  if (upcoming.length === 0) return null;
  const diff = new Date(upcoming[0].jourDebut).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function totalNightsBooked(bookings: ClientReservation[]): number {
  return bookings
    .filter((b) => b.statut !== "ANNULEE")
    .reduce((acc, b) => acc + nightsBetween(b.jourDebut, b.jourFin), 0);
}

// ============================================================================
// SECTION: Booking Detail Modal
// ============================================================================
function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: ClientReservation;
  onClose: () => void;
}) {
  const t = useTranslations("clientDashboard");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const { cancelBooking, payBooking, isLoading } = useReservationStore();
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPayConfirm, setShowPayConfirm] = useState(false);

  const nights = nightsBetween(booking.jourDebut, booking.jourFin);
  const isCancellable = booking.statut === "EN_ATTENTE" || booking.statut === "CONFIRMEE" || booking.statut === "IMPAYEE" || booking.statut === "PAYEE";
  const isPayable = booking.statut === "IMPAYEE";

  const { hotels } = useHotelsStore();
  const hotel = hotels.find((h) => h.id === booking.hotelId);
  const cancellationPolicy = hotel?.cancellationPolicy || "Aucune politique d'annulation spécifiée.";

  const handleCancel = async () => {
    await cancelBooking(booking.id);
    onClose();
  };

  const handlePay = async () => {
    await payBooking(booking.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.title")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-charcoal rounded-3xl border border-foreground/10 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Hotel image banner */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={booking.hotelImage}
            alt={booking.hotelNom}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#1c1714]" />

          {/* Close button */}
          <button
            id="booking-detail-close"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label={t("detail.close")}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status badge over image */}
          <div className="absolute bottom-3 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_STYLES[booking.statut]}`}>
              {t(`status.${booking.statut}`)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <h2
              className="text-foreground font-bold text-xl leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {booking.hotelNom}
            </h2>
            <p className="flex items-center gap-1 text-foreground/50 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {booking.hotelVille} — {booking.chambreType} #{booking.chambreNumero}
            </p>
          </div>

          {/* Detail rows */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: CalendarDays,
                label: t("upcoming.checkIn"),
                value: fmtDate(booking.jourDebut),
              },
              {
                icon: CalendarDays,
                label: t("upcoming.checkOut"),
                value: fmtDate(booking.jourFin),
              },
              {
                icon: Moon,
                label: t("upcoming.nights"),
                value: `${nights} ${t("upcoming.nights")}`,
              },
              {
                icon: User,
                label: t("upcoming.guests"),
                value: `${booking.nombrePersonnes} ${t("upcoming.guests")}`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-foreground/5 rounded-xl p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5 text-foreground/40">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-foreground text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gold/8 border border-gold/20 rounded-2xl px-5 py-4">
            <span className="text-foreground/60 text-sm">{t("detail.total")}</span>
            <span
              className="text-gold font-black text-2xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {formatPrice(booking.montantTotal, currency, locale)}
            </span>
          </div>

          {/* Actions */}
          {!showCancelConfirm && !showPayConfirm && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <button
                  id="booking-detail-download"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 text-sm font-semibold transition-all"
                >
                  <Download className="w-4 h-4" />
                  {t("actions.downloadReceipt")}
                </button>
                <button
                  id="booking-detail-dismiss"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-purple text-white font-bold text-sm hover:opacity-90 dark:bg-gold dark:text-[#1c1714] transition-all"
                >
                  {t("detail.close")}
                </button>
              </div>
              
              {isPayable && (
                <button
                  onClick={() => setShowPayConfirm(true)}
                  className="w-full py-3 rounded-xl bg-purple hover:bg-purple-600 text-white font-semibold text-sm transition-colors"
                >
                  Payer la réservation
                </button>
              )}

              {isCancellable && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/10 transition-colors"
                >
                  Annuler la réservation
                </button>
              )}
            </div>
          )}

          {/* Cancellation Confirmation */}
          {showCancelConfirm && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in">
              <h3 className="text-red-400 font-bold">Confirmer l'annulation</h3>
              <p className="text-foreground/70 text-sm">Politique d'annulation de l'établissement :</p>
              <p className="text-foreground/90 text-sm italic border-l-2 border-red-500/50 pl-3">{cancellationPolicy}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-foreground/15 text-foreground/70 text-sm hover:bg-foreground/5"
                >
                  Retour
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                >
                  {isLoading ? "En cours..." : "Confirmer"}
                </button>
              </div>
            </div>
          )}

          {/* Payment Confirmation */}
          {showPayConfirm && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex flex-col gap-3 animate-in fade-in">
              <h3 className="text-purple-400 font-bold">Confirmer le paiement</h3>
              <p className="text-foreground/70 text-sm">
                Vous êtes sur le point de régler <span className="font-bold text-foreground">{formatPrice(booking.montantTotal, currency, locale)}</span>.
              </p>
              <p className="text-foreground/70 text-sm">Politique d'annulation applicable :</p>
              <p className="text-foreground/90 text-sm italic border-l-2 border-purple-500/50 pl-3">{cancellationPolicy}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowPayConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-foreground/15 text-foreground/70 text-sm hover:bg-foreground/5"
                >
                  Retour
                </button>
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 disabled:opacity-50"
                >
                  {isLoading ? "Traitement..." : "Payer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: Hero Stats
// ============================================================================
function HeroStats() {
  const t = useTranslations("clientDashboard");
  const { user } = useAuthStore();
  const { bookings } = useReservationStore();

  const daysUntil = daysUntilNextBooking(bookings);
  const totalNights = totalNightsBooked(bookings);
  const memberSince = (user as any)?.createdAt
    ? new Date((user as any).createdAt).getFullYear()
    : new Date().getFullYear();

  const stats = [
    {
      icon: CalendarDays,
      label: daysUntil !== null
        ? `${t("hero.nextBooking")} ${daysUntil} ${t("hero.nextBookingDays")}`
        : t("hero.noUpcoming"),
      value: daysUntil !== null ? daysUntil : "—",
      sub: daysUntil !== null ? t("hero.nextBookingDays") : undefined,
      accent: "gold" as const,
    },
    {
      icon: Moon,
      label: t("hero.totalNights"),
      value: totalNights,
      accent: "emerald" as const,
    },
    {
      icon: Clock3,
      label: t("hero.memberSince"),
      value: memberSince,
      accent: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          icon={s.icon}
          label={s.label}
          value={s.value}
          accent={s.accent}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SECTION: Upcoming Bookings
// ============================================================================
function UpcomingBookings() {
  const t = useTranslations("clientDashboard");
  const locale = useLocale();
  const { openDetail } = useClientDashboardStore();
  const { bookings } = useReservationStore();
  
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAYEE" | "IMPAYEE">("ALL");

  const allUpcoming = getUpcomingBookings(bookings);
  const upcoming = allUpcoming.filter(b => {
    if (filterStatus === "ALL") return true;
    return b.statut === filterStatus;
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2
            className="text-foreground font-bold text-white text-xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("upcoming.title")}
          </h2>
          <span className="text-foreground/40 text-white text-sm">({upcoming.length})</span>
        </div>
        
        {/* Filters */}
        <div className="flex bg-foreground/5 rounded-lg p-1 text-sm border border-foreground/10">
          {(["ALL", "PAYEE", "IMPAYEE"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === f
                  ? "bg-foreground/10 text-white font-bold text-foreground"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {f === "ALL" ? "Toutes" : f === "PAYEE" ? "Payées" : "Impayées"}
            </button>
          ))}
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="bg-charcoal rounded-2xl border border-foreground/10 p-10 text-center flex flex-col items-center gap-4">
          <Hotel className="w-10 h-10 text-foreground/20" />
          <p className="text-foreground/40 text-sm">
            {filterStatus === "ALL" ? t("upcoming.empty") : "Aucune réservation avec ce statut."}
          </p>
          {filterStatus === "ALL" && (
            <Link
              id="upcoming-browse-hotels"
              href={`/${locale}/hotels`}
              className="px-6 py-2.5 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm hover:opacity-90 transition-all"
            >
              {t("upcoming.emptyAction")}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((b) => (
            <BookingCard key={b.id} booking={b} onClick={() => openDetail(b)} />
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// SECTION: Quick Actions
// ============================================================================
function QuickActions() {
  const t = useTranslations("clientDashboard");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const { selectedBooking } = useClientDashboardStore();

  const generateReceipt = () => {
    if (!selectedBooking) return;
    const b = selectedBooking;
    const nights = Math.round(
      (new Date(b.jourFin).getTime() - new Date(b.jourDebut).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const formattedAmount = new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(b.montantTotal);

    const receiptHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Reçu HotelHub — ${b.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 40px; max-width: 640px; margin: 0 auto; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; }
    .logo span { color: #c9a84c; }
    .tagline { color: #888; font-size: 12px; margin-bottom: 32px; }
    .divider { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #d1fae5; color: #065f46; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .ref { color: #888; font-size: 13px; margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #555; }
    .row .value { font-weight: 600; text-align: right; }
    .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; padding: 16px 0 0; color: #c9a84c; }
    .footer { margin-top: 40px; text-align: center; color: #bbb; font-size: 11px; line-height: 1.8; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="logo">Hotel<span>Hub</span></div>
  <p class="tagline">Votre partenaire hébergement au Cameroun</p>

  <div class="badge">✓ Réservation ${b.statut === "CONFIRMEE" ? "Confirmée" : b.statut}</div>
  <h1>${b.hotelNom}</h1>
  <p class="ref">Référence : ${b.id} &nbsp;•&nbsp; Généré le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>

  <hr class="divider" />

  <p class="section-title">Détails du séjour</p>
  <div class="row"><span class="label">Hôtel</span><span class="value">${b.hotelNom}</span></div>
  <div class="row"><span class="label">Ville</span><span class="value">${b.hotelVille}</span></div>
  <div class="row"><span class="label">Chambre</span><span class="value">${b.chambreType} — N°${b.chambreNumero}</span></div>
  <div class="row"><span class="label">Arrivée</span><span class="value">${new Date(b.jourDebut).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span></div>
  <div class="row"><span class="label">Départ</span><span class="value">${new Date(b.jourFin).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span></div>
  <div class="row"><span class="label">Durée</span><span class="value">${nights} nuit${nights > 1 ? "s" : ""}</span></div>
  <div class="row"><span class="label">Voyageurs</span><span class="value">${b.nombrePersonnes} personne${b.nombrePersonnes > 1 ? "s" : ""}</span></div>

  <hr class="divider" />

  <p class="section-title">Récapitulatif de paiement</p>
  <div class="row"><span class="label">Prix par nuit</span><span class="value">${new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", maximumFractionDigits: 0 }).format(Math.round(b.montantTotal / nights))}</span></div>
  <div class="row"><span class="label">Nombre de nuits</span><span class="value">× ${nights}</span></div>
  <div class="total-row"><span>Total réglé</span><span>${formattedAmount}</span></div>

  <hr class="divider" />

  <div class="footer">
    <p>Merci de votre confiance — HotelHub &copy; ${new Date().getFullYear()}</p>
    <p>Ce document est une confirmation de réservation et peut servir de reçu.</p>
    <p style="margin-top:8px; color: #ccc;">support@hotelhub.cm &nbsp;•&nbsp; www.hotelhub.cm</p>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recu-hotelhub-${b.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const actions = [
    {
      id: "action-browse-hotels",
      icon: Map,
      label: t("actions.browseHotels"),
      href: `/${locale}/hotels`,
      disabled: false,
      variant: "primary",
      onClick: undefined as (() => void) | undefined,
    },
    {
      id: "action-download-receipt",
      icon: Download,
      label: t("actions.downloadReceipt"),
      href: undefined,
      disabled: !selectedBooking,
      variant: "secondary",
      onClick: generateReceipt,
    },
    {
      id: "action-contact-support",
      icon: Headphones,
      label: t("actions.contactSupport"),
      href: `/${locale}/contact`,
      disabled: false,
      variant: "secondary",
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2
        className="text-foreground font-bold text-xl"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("actions.title")}
      </h2>

      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const cls = `
            flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${action.variant === "primary"
              ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] hover:opacity-90 shadow-md shadow-purple/20 dark:shadow-gold/20"
              : "bg-charcoal border border-foreground/10 text-foreground/70 hover:text-foreground hover:border-foreground/25"
            }
            ${action.disabled ? "opacity-40 cursor-not-allowed" : ""}
          `;

          return action.href && !action.disabled ? (
            <Link key={action.id} id={action.id} href={action.href} className={cls}>
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ) : (
            <button
              key={action.id}
              id={action.id}
              disabled={action.disabled}
              onClick={action.onClick}
              className={cls}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// SECTION: Past Bookings
// ============================================================================
function PastBookings({
  reviewedIds,
  setReviewingBooking
}: {
  reviewedIds: Set<string>;
  setReviewingBooking: (booking: ClientReservation) => void;
}) {
  const t = useTranslations("clientDashboard");
  const { showPastBookings, togglePastBookings } = useClientDashboardStore();
  const { bookings } = useReservationStore();
  const past = getPastBookings(bookings);

  return (
    <section className="flex flex-col gap-4">
      {/* Toggle header */}
      <button
        id="toggle-past-bookings"
        onClick={togglePastBookings}
        className="flex items-center justify-between w-full bg-charcoal rounded-2xl border border-foreground/10 px-5 py-4 text-left hover:border-foreground/20 transition-colors group"
      >
        <span
          className="text-foreground font-bold text-base transition-colors"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("past.title")}
          <span className="ml-2 text-foreground/30 text-sm font-normal">({past.length})</span>
        </span>
        {showPastBookings ? (
          <ChevronUp className="w-5 h-5 text-foreground/40 group-hover:text-gold transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-foreground/40 group-hover:text-gold transition-colors" />
        )}
      </button>

      {/* Past bookings list */}
      {showPastBookings && (
        <div className="flex flex-col gap-3">
          {past.length === 0 ? (
            <p className="text-foreground/40 text-sm text-center py-8">{t("past.empty")}</p>
          ) : (
            past.map((b) => (
              <div key={b.id} className="relative">
                <BookingCard booking={b} />
                {/* Leave review CTA for completed stays */}
                {b.statut === "TERMINEE" && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      id={`review-${b.id}`}
                      disabled={reviewedIds.has(b.id)}
                      onClick={() => setReviewingBooking(b)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${
                        reviewedIds.has(b.id)
                          ? "bg-foreground/5 text-foreground/40 cursor-not-allowed"
                          : "bg-gold/10 border border-gold/25 hover:bg-gold/20 text-gold"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      {reviewedIds.has(b.id) ? "Avis soumis" : t("past.leaveReview")}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// SECTION: Account Info Card (sidebar on desktop)
// ============================================================================
function AccountCard() {
  const t = useTranslations("clientDashboard");
  const locale = useLocale();
  const { user, logout } = useAuthStore();
  const { setActiveTab } = useClientDashboardStore();
  const { getUnreadCount } = useMessagesStore();
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showNoNotif, setShowNoNotif] = useState(false);
  const [formData, setFormData] = useState({
    telephone: user?.telephone ?? "",
    adresse:   (user as any)?.adresse ?? "",
    email:     user?.email ?? "",
    newPassword: "",
  });

  const initials = user?.nom
    ? user.nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CL";

  return (
    <div className="flex flex-col gap-4">
      {/* Profile header */}
      <div className="bg-charcoal rounded-2xl border border-foreground/10 p-6 flex flex-col gap-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple to-purple/50 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {initials}
          </div>
          <div>
            <p
              className="text-foreground font-bold text-base leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {user?.nom ?? "Client"}
            </p>
            <p className="text-foreground/40 text-xs mt-0.5">{t("role")}</p>
          </div>
        </div>

        {/* Contact info rows */}
        <div className="flex flex-col gap-2.5 border-t border-foreground/8 pt-4">
          {[
            { id: "email",    icon: Mail,   value: user?.email ?? "—" },
            { id: "phone",    icon: Phone,  value: user?.telephone ?? "—" },
            { id: "location", icon: MapPin, value: (user as any)?.localisation ?? "—" },
          ].map(({ id, icon: Icon, value }) => (
            <div key={id} className="flex items-center gap-3 text-sm">
              <Icon className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
              <span className="text-foreground/60 truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 border-t border-foreground/8 pt-4">
          <button
            id="account-edit-profile"
            onClick={() => setIsEditOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 text-foreground/70 hover:text-foreground text-sm font-semibold transition-all"
          >
            <User className="w-4 h-4" />
            {t("account.editProfile")}
          </button>

          <button
            id="account-notifications"
            onClick={() => {
              if (unreadCount > 0) {
                setActiveTab("messages");
              } else {
                setShowNoNotif(true);
                setTimeout(() => setShowNoNotif(false), 3000);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 text-foreground/70 hover:text-foreground text-sm font-semibold transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {t("account.notifications")}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
            
            {/* Small inline modal/toast for no notifications */}
            {showNoNotif && (
              <div className="absolute top-full left-0 mt-2 w-max max-w-[200px] z-50 bg-charcoal border border-foreground/10 shadow-xl rounded-xl p-3 text-xs text-foreground/80 animate-in fade-in slide-in-from-top-2">
                {t("account.noNotifications") || "Vous n'avez aucune nouvelle notification."}
              </div>
            )}
          </button>

          <Link
            id="account-logout"
            href={`/${locale}`}
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/35 text-red-400 text-sm font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            {t("logout")}
          </Link>
        </div>
      </div>

      {/* Inline edit form (collapsible) */}
      {isEditOpen && (
        <div className="bg-charcoal rounded-2xl border border-foreground/10 focus-within:border-gold/30 p-6 flex flex-col gap-4 transition-colors duration-200">
          <h3
            className="text-foreground font-bold text-base"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("account.editProfile")}
          </h3>

          {[
            { key: "telephone" as const, label: t("account.phone"), type: "tel" },
            { key: "adresse" as const,   label: t("account.address"), type: "text" },
            { key: "email" as const,     label: t("account.email"), type: "email" },
          ].map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                {f.label}
              </label>
              <input
                type={f.type}
                value={formData[f.key]}
                onChange={(e) =>
                  setFormData({ ...formData, [f.key]: e.target.value })
                }
                className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
              {t("account.newPassword")}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground text-sm placeholder-foreground/20 focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              id="account-save"
              className="flex-1 py-3 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm hover:opacity-90 transition-all"
            >
              {t("account.save")}
            </button>
            <button
              id="account-cancel"
              onClick={() => setIsEditOpen(false)}
              className="px-5 py-3 rounded-xl border border-foreground/15 text-foreground/60 hover:text-foreground text-sm font-semibold transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ROOT: ClientDashboard (page-level component)
// ============================================================================
export default function ClientDashboard() {
  const t = useTranslations("clientDashboard");
  const { user, directors } = useAuthStore();
  const { bookings, fetchBookings, isLoading } = useReservationStore();
  const { getUnreadCount, messages } = useMessagesStore();
  const { activeTab, setActiveTab, selectedBooking, isDetailOpen, closeDetail } =
    useClientDashboardStore();

  const [reviewingBooking, setReviewingBooking] = useState<ClientReservation | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [clientReviews, setClientReviews] = useState<BackendReviewDTO[]>([]);

  useEffect(() => {
    const ids = bookings
      .filter((b) => hasReviewedBooking(b.id))
      .map((b) => b.id);
    setReviewedIds(new Set(ids));
  }, [bookings]);

  useEffect(() => {
    if (user?.id) {
      getReviewsForClient(user.id).then(setClientReviews);
    }
  }, [user?.id, reviewedIds]);

  useEffect(() => {
    if (user?.id) {
      fetchBookings(user.id);
    }
  }, [user?.id, fetchBookings]);

  type Tab = "reservations" | "avis" | "profil" | "messages";

  // Build director contacts from the hotels where the client has bookings
  const myHotelIds = [...new Set(bookings.map((b) => b.hotelId))];
  const baseContacts = directors
    .filter((d) => myHotelIds.includes(d.hotelId))
    .map((d) => ({
      id: d.id,
      name: d.nom,
      role: "Directeur d'hôtel",
      avatarInitial: d.nom.charAt(0).toUpperCase(),
    }));

  const messageContacts = [...baseContacts];
  const contactIds = new Set(baseContacts.map(c => c.id));

  // Add directors the client chatted with even if no booking yet
  if (user) {
    const chatIds = new Set(
      messages
        .filter(m => m.senderId === user.id || m.receiverId === user.id)
        .map(m => m.senderId === user.id ? m.receiverId : m.senderId)
    );

    chatIds.forEach(id => {
      if (!contactIds.has(id)) {
        const dir = directors.find(d => d.id === id);
        if (dir) {
          messageContacts.push({
            id: dir.id,
            name: dir.nom,
            role: "Directeur d'hôtel",
            avatarInitial: dir.nom.charAt(0).toUpperCase(),
          });
          contactIds.add(dir.id);
        }
      }
    });
  }

  const clientCurrentUser = user
    ? { id: user.id, name: user.nom, role: "Client" }
    : null;

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "reservations", label: t("tabs.bookings") },
    { key: "avis",         label: t("tabs.reviews") },
    { key: "messages",     label: t("tabs.messages") || "Messages", badge: unreadCount },
    { key: "profil",       label: t("tabs.profile") },
  ];

  return (
    <>
      <Header />

      {/* Booking detail modal */}
      {isDetailOpen && selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={closeDetail} />
      )}

      {/* Review modal */}
      {reviewingBooking && (
        <ReviewModal
          booking={reviewingBooking}
          onClose={() => setReviewingBooking(null)}
          onSuccess={() => {
            setReviewedIds((prev) => new Set(prev).add(reviewingBooking.id));
            setReviewingBooking(null);
          }}
        />
      )}

      <main className="min-h-screen relative pt-28 pb-16">
        {/* Optimized Background Image for max LCP speed */}
        <div className="fixed inset-0 -z-20">
          <Image 
            src="https://images.pexels.com/photos/7820321/pexels-photo-7820321.jpeg"
            alt="Client Dashboard Background"
            fill
            quality={90}
            priority
            className="object-cover"
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="fixed inset-0 bg-black/75 -z-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-10 relative z-10">

          {/* ── Page heading ───────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-white/40 text-sm uppercase tracking-widest mb-1">
                {t("greeting")}
              </p>
              <h1
                className="text-white font-black text-3xl sm:text-4xl leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {user?.nom ?? "Client"}
              </h1>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit flex-wrap">
              {tabs.map(({ key, label, badge }) => (
                <button
                  key={key}
                  id={`tab-${key}`}
                  onClick={() => setActiveTab(key)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === key
                      ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {label}
                  {badge && badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab: Reservations ──────────────────────────────────────────── */}
          {activeTab === "reservations" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <HeroStats />
                <UpcomingBookings />
                <QuickActions />
                <PastBookings reviewedIds={reviewedIds} setReviewingBooking={setReviewingBooking} />
              </div>

              {/* Sticky sidebar (desktop) */}
              <div className="hidden lg:block sticky top-28">
                <AccountCard />
              </div>
            </div>
          )}

          {/* ── Tab: Reviews ───────────────────────────────────────────────── */}
          {activeTab === "avis" && (
            <div className="flex flex-col gap-4">
              {bookings
                .filter((b) => b.statut === "TERMINEE")
                .map((b) => {
                  const review = clientReviews.find((r) => r.booking_ref === b.id);
                  return (
                    <div
                      key={b.id}
                      className="bg-charcoal rounded-2xl border border-foreground/10 p-5 flex flex-col gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p
                            className="text-foreground font-bold text-base"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {b.hotelNom}
                          </p>
                          <p className="text-foreground/40 text-xs mt-0.5">
                            {fmtDate(b.jourDebut)} → {fmtDate(b.jourFin)}
                          </p>
                        </div>
                        <button
                          id={`leave-review-${b.id}`}
                          disabled={reviewedIds.has(b.id)}
                          onClick={() => setReviewingBooking(b)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 ${
                            reviewedIds.has(b.id)
                              ? "bg-foreground/5 text-foreground/40 cursor-not-allowed"
                              : "bg-gold/10 border border-gold/25 hover:bg-gold/20 text-gold"
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          {reviewedIds.has(b.id) ? "Avis soumis" : t("past.leaveReview")}
                        </button>
                      </div>

                      {review && (
                        <div className="mt-2 p-4 bg-foreground/5 rounded-xl flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-gold fill-gold"
                                      : "text-foreground/20"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-foreground/40 text-xs">
                              {new Date(review.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-foreground/80 text-sm">
                              &quot;{review.comment}&quot;
                            </p>
                          )}
                          {review.director_reply && (
                            <div className="mt-3 pl-4 border-l-2 border-purple">
                              <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1 font-semibold">
                                Réponse du directeur
                              </p>
                              <p className="text-foreground/70 text-sm">{review.director_reply}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

              {bookings.filter((b) => b.statut === "TERMINEE").length === 0 && (
                <p className="text-white/30 text-sm text-center py-12">{t("past.empty")}</p>
              )}
            </div>
          )}

          {/* ── Tab: Messages ───────────────────────────────────────────── */}
          {activeTab === "messages" && clientCurrentUser && (
            <div>
              {messageContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-white/40">
                  <MessageSquare className="w-12 h-12" />
                  <p className="text-sm text-center max-w-xs">
                    {t("messages.noContacts") || "Vous n'avez pas encore de réservation active. Réservez un hôtel pour pouvoir contacter son directeur."}
                  </p>
                </div>
              ) : (
                <MessagesTab
                  currentUser={clientCurrentUser}
                  contacts={messageContacts}
                  t={t}
                />
              )}
            </div>
          )}

          {/* ── Tab: Profile (mobile — desktop shows sidebar) ──────────────── */}
          {activeTab === "profil" && (
            <div className="max-w-md mx-auto w-full">
              <AccountCard />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
