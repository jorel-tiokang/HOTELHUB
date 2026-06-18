"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useClientDashboardStore } from "@/store/clientDashboardStore";
import {
  clientBookings,
  getUpcomingBookings,
  getPastBookings,
  daysUntilNextBooking,
  totalNightsBooked,
  type ClientReservation,
  type StatutReservationClient,
} from "@/mocks/clientBookings";
import Header from "@/src/components/Header";
import { Footer } from "@/src/components/footer";
import BookingCard from "@/src/components/BookingCard";
import StatCard from "@/src/components/StatCard";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

// ── Status colour map ────────────────────────────────────────────────────────
const STATUT_STYLES: Record<StatutReservationClient, string> = {
  CONFIRMEE: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  ANNULEE:   "bg-red-500/20 text-red-400 border border-red-500/30",
  TERMINEE:  "bg-white/10 text-white/50 border border-white/15",
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
  const nights = nightsBetween(booking.jourDebut, booking.jourFin);

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
      <div className="relative z-10 w-full max-w-lg bg-[#1c1714] rounded-3xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
              className="text-white font-bold text-xl leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {booking.hotelNom}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              📍 {booking.hotelVille} — {booking.chambreType} #{booking.chambreNumero}
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
                className="bg-white/5 rounded-xl p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5 text-white/40">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wider">{label}</span>
                </div>
                <p className="text-white text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gold/8 border border-gold/20 rounded-2xl px-5 py-4">
            <span className="text-white/60 text-sm">{t("detail.total")}</span>
            <span
              className="text-gold font-black text-2xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {formatPrice(booking.montantTotal, currency, locale)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              id="booking-detail-download"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm font-semibold transition-all"
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

  const daysUntil = daysUntilNextBooking();
  const totalNights = totalNightsBooked();
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
  const upcoming = getUpcomingBookings();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-white font-bold text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("upcoming.title")}
        </h2>
        <span className="text-white/40 text-sm">{upcoming.length}</span>
      </div>

      {upcoming.length === 0 ? (
        <div className="bg-charcoal rounded-2xl border border-white/10 p-10 text-center flex flex-col items-center gap-4">
          <Hotel className="w-10 h-10 text-white/20" />
          <p className="text-white/40 text-sm">{t("upcoming.empty")}</p>
          <Link
            id="upcoming-browse-hotels"
            href={`/${locale}/hotels`}
            className="px-6 py-2.5 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm hover:opacity-90 transition-all"
          >
            {t("upcoming.emptyAction")}
          </Link>
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
  const { selectedBooking } = useClientDashboardStore();

  const actions = [
    {
      id: "action-browse-hotels",
      icon: Map,
      label: t("actions.browseHotels"),
      href: `/${locale}/hotels`,
      disabled: false,
      variant: "primary",
    },
    {
      id: "action-download-receipt",
      icon: Download,
      label: t("actions.downloadReceipt"),
      href: undefined,
      disabled: !selectedBooking,
      variant: "secondary",
    },
    {
      id: "action-contact-support",
      icon: Headphones,
      label: t("actions.contactSupport"),
      href: `/${locale}/contact`,
      disabled: false,
      variant: "secondary",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2
        className="text-white font-bold text-xl"
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
              : "bg-charcoal border border-white/10 text-white/70 hover:text-white hover:border-white/25"
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
function PastBookings() {
  const t = useTranslations("clientDashboard");
  const { showPastBookings, togglePastBookings } = useClientDashboardStore();
  const past = getPastBookings();

  return (
    <section className="flex flex-col gap-4">
      {/* Toggle header */}
      <button
        id="toggle-past-bookings"
        onClick={togglePastBookings}
        className="flex items-center justify-between w-full bg-charcoal rounded-2xl border border-white/10 px-5 py-4 text-left hover:border-white/20 transition-colors group"
      >
        <span
          className="text-white font-bold text-base group-hover:text-gold transition-colors"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("past.title")}
          <span className="ml-2 text-white/30 text-sm font-normal">({past.length})</span>
        </span>
        {showPastBookings ? (
          <ChevronUp className="w-5 h-5 text-white/40 group-hover:text-gold transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-gold transition-colors" />
        )}
      </button>

      {/* Past bookings list */}
      {showPastBookings && (
        <div className="flex flex-col gap-3">
          {past.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-8">{t("past.empty")}</p>
          ) : (
            past.map((b) => (
              <div key={b.id} className="relative">
                <BookingCard booking={b} />
                {/* Leave review CTA for completed stays */}
                {b.statut === "TERMINEE" && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      id={`review-${b.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/25 text-gold text-xs font-semibold hover:bg-gold/20 transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      {t("past.leaveReview")}
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
  const [isEditOpen, setIsEditOpen] = useState(false);
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
      <div className="bg-charcoal rounded-2xl border border-white/10 p-6 flex flex-col gap-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple to-purple/50 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {initials}
          </div>
          <div>
            <p
              className="text-white font-bold text-base leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {user?.nom ?? "Client"}
            </p>
            <p className="text-white/40 text-xs mt-0.5">{t("role")}</p>
          </div>
        </div>

        {/* Contact info rows */}
        <div className="flex flex-col gap-2.5 border-t border-white/8 pt-4">
          {[
            { id: "email",    icon: Mail,   value: user?.email ?? "—" },
            { id: "phone",    icon: Phone,  value: user?.telephone ?? "—" },
            { id: "location", icon: MapPin, value: (user as any)?.localisation ?? "—" },
          ].map(({ id, icon: Icon, value }) => (
            <div key={id} className="flex items-center gap-3 text-sm">
              <Icon className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <span className="text-white/60 truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 border-t border-white/8 pt-4">
          <button
            id="account-edit-profile"
            onClick={() => setIsEditOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-semibold transition-all"
          >
            <User className="w-4 h-4" />
            {t("account.editProfile")}
          </button>

          <button
            id="account-notifications"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-semibold transition-all"
          >
            <Bell className="w-4 h-4" />
            {t("account.notifications")}
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
        <div className="bg-charcoal rounded-2xl border border-white/10 focus-within:border-gold/30 p-6 flex flex-col gap-4 transition-colors duration-200">
          <h3
            className="text-white font-bold text-base"
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
              <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                {f.label}
              </label>
              <input
                type={f.type}
                value={formData[f.key]}
                onChange={(e) =>
                  setFormData({ ...formData, [f.key]: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
              {t("account.newPassword")}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors"
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
              className="px-5 py-3 rounded-xl border border-white/15 text-white/60 hover:text-white text-sm font-semibold transition-all"
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
  const { user } = useAuthStore();
  const { activeTab, setActiveTab, selectedBooking, isDetailOpen, closeDetail } =
    useClientDashboardStore();

  type Tab = "reservations" | "avis" | "profil";

  const tabs: { key: Tab; label: string }[] = [
    { key: "reservations", label: t("tabs.bookings") },
    { key: "avis",         label: t("tabs.reviews") },
    { key: "profil",       label: t("tabs.profile") },
  ];

  return (
    <>
      <Header />

      {/* Booking detail modal */}
      {isDetailOpen && selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={closeDetail} />
      )}

      <main 
        className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative pt-28 pb-16"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/7820321/pexels-photo-7820321.jpeg')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/75 z-0" />
        
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
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  id={`tab-${key}`}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === key
                      ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] shadow"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {label}
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
                <PastBookings />
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
              {clientBookings
                .filter((b) => b.statut === "TERMINEE")
                .map((b) => (
                  <div
                    key={b.id}
                    className="bg-charcoal rounded-2xl border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p
                        className="text-white font-bold text-base"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {b.hotelNom}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {fmtDate(b.jourDebut)} → {fmtDate(b.jourFin)}
                      </p>
                    </div>
                    <button
                      id={`leave-review-${b.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/25 hover:bg-gold/20 text-gold text-sm font-semibold transition-colors shrink-0"
                    >
                      <Star className="w-4 h-4" />
                      {t("past.leaveReview")}
                    </button>
                  </div>
                ))}

              {clientBookings.filter((b) => b.statut === "TERMINEE").length === 0 && (
                <p className="text-white/30 text-sm text-center py-12">{t("past.empty")}</p>
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
