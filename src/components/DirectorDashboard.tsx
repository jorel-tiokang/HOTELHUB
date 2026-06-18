"use client";

import Link from "next/link";
import RoomCard from "@/src/components/RoomCard";
import AddRoomModal from "@/src/components/AddRoomModal";
import type { Chambre } from "@/types/chambre";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice, formatCompactPrice } from "@/utils/currency";
import ModeToggle from "@/src/components/ModeTogge";
import LanguageToggle from "@/src/components/LanguageToggle";
import CurrencyToggle from "@/src/components/CurrencyToggle";
import {
  mockAvis,
  mockDirecteurHotel,
  weeklyOccupancyData,
  latestReviews,
  staffMembers,
} from "@/mocks/dashboardMocks";
import { useHotelsStore } from "@/store/hotelsStore";
import { useReservationStore } from "@/store/reservationStore";
import type { Room } from "@/services/hotel";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  BarChart3,
  Star,
  Users,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Check,
  X,
  MessageSquare,
  Send,
  LogOut,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Tab =
  | "overview"
  | "rooms"
  | "bookings"
  | "reviews"
  | "statistics"
  | "staff"
  | "settings";

const STATUT_CHAMBRE_STYLE: Record<string, string> = {
  DISPONIBLE: "bg-gold/20 text-gold",
  INDISPONIBLE: "bg-red-500/20 text-red-400",
};

const STATUT_RES_STYLE: Record<string, string> = {
  CONFIRMEE: "bg-emerald-500/20 text-emerald-400",
  EN_ATTENTE: "bg-gold/20 text-gold",
  ANNULEE: "bg-red-500/20 text-red-400",
};

const STATUT_RES_LABEL: Record<string, string> = {
  CONFIRMEE: "Confirmee",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulee",
};



export default function DirectorDashboard() {
  const t = useTranslations("directeurDashboard");

  const navItems = [
    { id: "overview", label: t("nav.overview"), icon: LayoutDashboard },
    { id: "rooms", label: t("nav.rooms"), icon: BedDouble },
    { id: "bookings", label: t("nav.bookings"), icon: CalendarCheck },
    { id: "statistics", label: t("nav.statistics"), icon: BarChart3 },
    { id: "reviews", label: t("nav.reviews"), icon: Star },
    { id: "staff", label: t("nav.staff"), icon: Users },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];
  const [editingRoom, setEditingRoom] = useState<Chambre | null>(null);
  const { user, logout } = useAuthStore();
  const { currency } = useCurrencyStore();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const { addRoom, updateRoom, deleteRoom, toggleRoomStatus, getHotelRooms } = useHotelsStore();
  const DIRECTOR_HOTEL_ID = (user as any)?.assigned_hotel_id ?? "h1";
  const chambres = getHotelRooms(DIRECTOR_HOTEL_ID) as Chambre[];
  
  const { bookings, fetchHotelBookings } = useReservationStore();

  useEffect(() => {
    fetchHotelBookings(DIRECTOR_HOTEL_ID);
  }, [DIRECTOR_HOTEL_ID, fetchHotelBookings]);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [reviewPeriod, setReviewPeriod] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const selectedBookingData = selectedBooking ? bookings.find((b) => b.id === selectedBooking) : null;

  const toggleStatut = (id: string) => toggleRoomStatus(DIRECTOR_HOTEL_ID, id);

  const filteredBookings =
    bookingFilter === "all"
      ? bookings
      : bookings.filter((b) => b.statut === bookingFilter.toUpperCase());

  const filteredReviews =
    reviewFilter === "all"
      ? latestReviews
      : latestReviews.filter((r) =>
          reviewFilter === "replied" ? r.reply !== null : r.reply === null,
        );

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[url('/blurRoom.jpg')] bg-cover bg-no-repeat relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed left-0 top-0 h-full backdrop-blur-md z-40 transition-all duration-300 ease-in-out flex flex-col ${
          sidebarHovered ? "w-[240px]" : "w-[72px]"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex item-center gap-3">
              <img
                src="/hotelhublogo.png"
                alt="HotelHub Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <p
                className="font-black text-purple text-lg whitespace-nowrap"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                HOTELHUB
              </p>
              <p className="text-gold text-xs whitespace-nowrap">
                {t("role")}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-purple/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple rounded-r-full" />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                  }`}
                >
                  {t(`nav.${item.id}`)}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Director Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold shrink-0">
              {user?.nom?.charAt(0) ?? "D"}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <p className="text-white font-semibold text-sm whitespace-nowrap">
                {user?.nom ?? t("role")}
              </p>
              <p className="text-white/40 text-xs whitespace-nowrap">
                {t("espace")}
              </p>
            </div>
          </div>
          <Link href="/login">
            <button
              onClick={logout}
              className={`mt-3 w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/5 transition-all ${
                sidebarHovered ? "" : "justify-center"
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span
                className={`text-xs overflow-hidden transition-all duration-300 ${
                  sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {t("logout")}
              </span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarHovered ? "ml-[240px]" : "ml-[72px]"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-gold/10">
          <div className="px-8 py-4 flex items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-black text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t(`nav.${activeTab}`)}
              </h1>
              <p className="text-white/80 text-sm capitalize">{currentDate}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <ModeToggle />
              <LanguageToggle />
              <CurrencyToggle />
              <button className="relative p-3 rounded-xl bg-purple/30 hover:bg-purple/50 transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-purple rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: t("kpi.totalRooms"),
                    value: chambres.length,
                    trend: "+2",
                    up: true,
                    icon: BedDouble,
                  },
                  {
                    label: t("kpi.activeBookings"),
                    value: bookings.filter(
                      (r) => r.statut === "CONFIRMEE",
                    ).length,
                    trend: "+5",
                    up: true,
                    icon: CalendarCheck,
                  },
                  {
                    label: t("kpi.occupancyRate"),
                    value: `${mockDirecteurHotel.tauxOccupation}%`,
                    trend: "+12%",
                    up: true,
                    icon: BarChart3,
                  },
                  {
                    label: t("kpi.averageRating"),
                    value: "4.8",
                    trend: "+0.2",
                    up: true,
                    icon: Star,
                  },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={kpi.label}
                      className="bg-charcoal rounded-2xl p-6 shadow-md animateCardBoxHover group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-xl bg-white/10">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${
                            kpi.up ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {kpi.up ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {kpi.trend}
                        </div>
                      </div>
                      <p
                        className="text-3xl font-black text-gold mb-1"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {kpi.value}
                      </p>
                      <p className="text-white/50 text-sm">{kpi.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chart and Recent Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Occupancy Chart */}
                <div className="lg:col-span-2 bg-charcoal rounded-2xl p-6 shadow-lg animateCardBoxHover">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {t("overview.weeklyOccupancy")}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={weeklyOccupancyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="day"
                          stroke="rgba(255,255,255,0.5)"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.5)"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(212, 175, 55, 0.15)" }}
                          contentStyle={{
                            backgroundColor: "#1C1714",
                            border: "1px solid rgba(212,175,55,0.3)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          // accept possibly undefined value coming from Recharts
                          formatter={(value: any) => [
                            `${value}%`,
                            "Occupation",
                          ]}
                        />
                        <Bar
                          dataKey="occupancy"
                          fill="rgb(212,175,55)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Latest Reviews Panel */}
                <div className="bg-charcoal rounded-2xl p-6 shadow-lg animateCardBoxHover">
                  <h3
                    className="text-lg font-bold text-white mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {t("overview.latestReviews")}
                  </h3>
                  <div className="space-y-4">
                    {latestReviews.slice(0, 3).map((review) => (
                      <div
                        key={review.id}
                        className="pb-4 border-b border-gold/10 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? "text-gold fill-gold"
                                    : "text-white/20"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/40 text-xs">
                            {review.guest}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm line-clamp-2">
                          &quot;{review.text}&quot;
                        </p>
                        {!review.reply && (
                          <button className="mt-2 text-xs text-purple flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {t("overview.unanswered")}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="mt-4 w-full py-2 text-sm text-gold hover:text-gold/80 flex items-center justify-center gap-1 transition-colors"
                  >
                    {t("overview.seeMore")}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("overview.recentBookings")}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Client
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          {t("bookings.table.roomType")}
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          {t("bookings.table.arrival")}
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          {t("bookings.table.departure")}
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          {t("bookings.table.status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.slice(0, 5).map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4 text-white font-medium">
                            Client ({booking.id.slice(-4)})
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.chambreType}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.jourDebut}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.jourFin}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                STATUT_RES_STYLE[booking.statut]
                              }`}
                            >
                              {STATUT_RES_LABEL[booking.statut]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="mt-4 w-full py-2 text-sm text-gold hover:text-gold/80 flex items-center justify-center gap-1 transition-colors"
                >
                  {t("overview.seeMore")}
                  <ChevronRight className="w-4 h-4" />
                </button>{" "}
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddRoom(true)}
                  className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-purple/20"
                >
                  <Plus className="w-5 h-5" />
                  {t("rooms.addRoom")}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambres.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onEdit={(room) => setEditingRoom(room)}
                    onDelete={(id) => deleteRoom(DIRECTOR_HOTEL_ID, id)}
                    onToggleStatut={toggleStatut}
                  />
                ))}
              </div>

              {showAddRoom && (
                <AddRoomModal
                  onSave={(data) => {
                    const newRoom: Room = {
                      ...data,
                      id: `r-${Date.now()}`,
                      hotelId: DIRECTOR_HOTEL_ID,
                      statut: "DISPONIBLE",
                    };
                    addRoom(DIRECTOR_HOTEL_ID, newRoom);
                    setShowAddRoom(false);
                  }}
                  onClose={() => setShowAddRoom(false)}
                />
              )}

              {editingRoom && (
                <AddRoomModal
                  initialData={editingRoom}
                  onSave={(data) => {
                    updateRoom(DIRECTOR_HOTEL_ID, {
                      ...data,
                      id: editingRoom.id,
                      hotelId: DIRECTOR_HOTEL_ID,
                      statut: editingRoom.statut,
                    });
                    setEditingRoom(null);
                  }}
                  onClose={() => setEditingRoom(null)}
                />
              )}
            </div>
          )}
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Bookings Table */}
              <div className="bg-charcoal rounded-2xl p-6 shadow-lg overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.id")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.guest")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.room")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.dates")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.price")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.status")}
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        {t("bookings.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-white/50 text-sm">
                          {booking.id}
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          Client ({booking.id.slice(-4)})
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {booking.chambreType}
                        </td>
                        <td className="py-4 px-4 text-white/70 text-sm">
                          {booking.jourDebut} - {booking.jourFin}
                        </td>
                        <td className="py-4 px-4 text-gold font-semibold">
                          {booking.montantTotal != null ? formatPrice(booking.montantTotal, currency, locale) : "—"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              STATUT_RES_STYLE[booking.statut]
                            }`}
                          >
                            {STATUT_RES_LABEL[booking.statut]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {booking.statut === "EN_ATTENTE" ? (
                              <>
                                <button className="p-2 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold transition-colors">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg border border-red-400/30 hover:bg-red-500/20 text-red-400 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setSelectedBooking(booking.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                              >
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-charcoal rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                    <h3
                      className="text-xl font-bold text-white mb-6"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {t("bookings.modal.title")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          {t("bookings.table.guest")}
                        </p>
                        <p className="text-white font-semibold">
                          Client ({selectedBookingData?.id?.slice(-4)})
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          {t("bookings.modal.email")}
                        </p>
                        <p className="text-white/70">client.{selectedBookingData?.id?.slice(-4).toLowerCase()}@email.com</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          {t("bookings.modal.phone")}
                        </p>
                        <p className="text-white/70">+237 699 123 456</p>
                      </div>
                      <div className="pt-4 border-t border-gold/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          {t("bookings.modal.transaction")}
                        </p>
                        <p className="text-gold font-semibold">
                          {selectedBookingData?.montantTotal != null ? formatPrice(selectedBookingData.montantTotal, currency, locale) : "—"}{" "}
                          — {STATUT_RES_LABEL[selectedBookingData?.statut ?? "CONFIRMEE"]}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                      {t("bookings.modal.close")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2 bg-charcoal rounded-xl p-1.5">
                  {[
                    { id: "all", label: t("reviews.filters.all") },
                    { id: "pending", label: t("reviews.filters.pending") },
                    { id: "replied", label: t("reviews.filters.replied") },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setReviewFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        reviewFilter === filter.id
                          ? "bg-purple text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <select
                  value={reviewPeriod}
                  onChange={(e) => setReviewPeriod(e.target.value)}
                  className="bg-charcoal text-white/70 px-4 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-purple"
                >
                  <option value="all">{t("reviews.periods.all")}</option>
                  <option value="week">{t("reviews.periods.week")}</option>
                  <option value="month">{t("reviews.periods.month")}</option>
                </select>
                <select className="bg-charcoal text-white/70 px-4 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-purple">
                  <option value="">{t("reviews.rooms.all")}</option>
                  {chambres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t("reviews.rooms.roomNumber")} {c.numero}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-charcoal rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                          {review.guest.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {review.guest}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-gold fill-gold"
                                      : "text-white/20"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-white/40 text-sm">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">
                      &quot;{review.text}&quot;
                    </p>

                    {review.reply ? (
                      <div className="ml-4 pl-4 border-l-2 border-purple bg-purple/5 rounded-r-xl p-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">
                          {t("reviews.yourReply")}
                        </p>
                        <p className="text-white/70">{review.reply}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          rows={3}
                          placeholder={t("reviews.replyPlaceholder")}
                          value={reponses[review.id] ?? ""}
                          onChange={(e) =>
                            setReponses({
                              ...reponses,
                              [review.id]: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple transition-colors resize-none"
                        />
                        <button className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                          <Send className="w-4 h-4" />
                          {t("reviews.sendReply")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "statistics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {t("statistics.bookingsThisMonth")}
                  </h3>
                  <p
                    className="text-4xl font-black text-gold"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {mockDirecteurHotel.statReservations}
                  </p>
                </div>
                <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {t("statistics.revenueThisMonth")}
                  </h3>
                  <p
                    className="text-4xl font-black text-gold"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {formatCompactPrice(mockDirecteurHotel.statRecettes, currency, locale)}
                  </p>
                </div>
              </div>

              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("statistics.occupancyRate")}
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{
                        width: `${mockDirecteurHotel.tauxOccupation}%`,
                      }}
                    />
                  </div>
                  <span
                    className="text-3xl font-black text-gold"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {mockDirecteurHotel.tauxOccupation}%
                  </span>
                </div>
              </div>

              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("statistics.roomAvailability")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gold/10 border border-gold/20 rounded-xl p-6 text-center">
                    <p
                      className="text-4xl font-black text-gold"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {chambres.filter((c) => c.statut === "DISPONIBLE").length}
                    </p>
                    <p className="text-gold/70 text-sm mt-2">{t("statistics.available")}</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
                    <p
                      className="text-4xl font-black text-red-400"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {
                        chambres.filter((c) => c.statut === "INDISPONIBLE")
                          .length
                      }
                    </p>
                    <p className="text-red-400/70 text-sm mt-2">{t("statistics.occupied")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("staff.title")}
                </h3>
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {staff.name}
                          </p>
                          <p className="text-white/50 text-sm">{staff.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="text-white/50 text-sm hidden sm:block">
                          {staff.contact}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            staff.status === "Actif"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <div className="bg-charcoal/90  rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("settings.title")}
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      {t("settings.hotelName")}
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.nom}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      {t("settings.contactEmail")}
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      {t("bookings.modal.phone")}
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.telephone}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple transition-colors"
                    />
                  </div>
                  <button className="bg-purple hover:bg-purple/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    {t("settings.save")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
