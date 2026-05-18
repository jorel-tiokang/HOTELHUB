"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  mockChambres,
  mockReservations,
  mockAvis,
  mockDirecteurHotel,
} from "@/mocks/dashboardMocks";
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

const weeklyOccupancyData = [
  { day: "Lun", occupancy: 65 },
  { day: "Mar", occupancy: 78 },
  { day: "Mer", occupancy: 82 },
  { day: "Jeu", occupancy: 74 },
  { day: "Ven", occupancy: 91 },
  { day: "Sam", occupancy: 95 },
  { day: "Dim", occupancy: 88 },
];

const recentBookings = [
  {
    id: "B001",
    guest: "Jean-Pierre Mbeki",
    roomType: "Suite Presidentielle",
    checkIn: "15 Mai 2026",
    checkOut: "18 Mai 2026",
    status: "CONFIRMEE",
  },
  {
    id: "B002",
    guest: "Marie Nguesso",
    roomType: "Chambre Double",
    checkIn: "16 Mai 2026",
    checkOut: "19 Mai 2026",
    status: "EN_ATTENTE",
  },
  {
    id: "B003",
    guest: "Paul Biya Jr.",
    roomType: "Junior Suite",
    checkIn: "17 Mai 2026",
    checkOut: "20 Mai 2026",
    status: "CONFIRMEE",
  },
  {
    id: "B004",
    guest: "Aminata Diallo",
    roomType: "Chambre Simple",
    checkIn: "18 Mai 2026",
    checkOut: "21 Mai 2026",
    status: "EN_ATTENTE",
  },
  {
    id: "B005",
    guest: "Kofi Mensah",
    roomType: "Suite Executive",
    checkIn: "19 Mai 2026",
    checkOut: "22 Mai 2026",
    status: "CONFIRMEE",
  },
];

const latestReviews = [
  {
    id: "R001",
    guest: "Sophie Etienne",
    rating: 5,
    text: "Sejour exceptionnel ! Le personnel est aux petits soins et la chambre etait impeccable.",
    date: "12 Mai 2026",
    reply: null,
  },
  {
    id: "R002",
    guest: "Marc Ondoa",
    rating: 4,
    text: "Tres bon hotel, juste la climatisation un peu bruyante la nuit.",
    date: "10 Mai 2026",
    reply:
      "Merci pour votre retour. Nous avons pris note et ferons le necessaire.",
  },
  {
    id: "R003",
    guest: "Fatou Ndiaye",
    rating: 5,
    text: "Le petit-dejeuner est delicieux et la vue depuis ma chambre etait magnifique !",
    date: "8 Mai 2026",
    reply: null,
  },
];

const staffMembers = [
  {
    id: "S001",
    name: "Alain Kamga",
    role: "Receptionniste",
    contact: "+237 699 123 456",
    status: "Actif",
  },
  {
    id: "S002",
    name: "Celine Fouda",
    role: "Gouvernante",
    contact: "+237 677 234 567",
    status: "Actif",
  },
  {
    id: "S003",
    name: "Bruno Essomba",
    role: "Concierge",
    contact: "+237 655 345 678",
    status: "Actif",
  },
  {
    id: "S004",
    name: "Diane Mbarga",
    role: "Chef Cuisinier",
    contact: "+237 699 456 789",
    status: "Inactif",
  },
];

const navItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "rooms", label: "Chambres", icon: BedDouble },
  { id: "bookings", label: "Reservations", icon: CalendarCheck },
  { id: "statistics", label: "Statistiques", icon: BarChart3 },
  { id: "reviews", label: "Avis", icon: Star },
  { id: "staff", label: "Personnel", icon: Users },
  { id: "settings", label: "Parametres", icon: Settings },
];

export default function DashboardDirecteurPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [chambres, setChambres] = useState(mockChambres);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [reviewPeriod, setReviewPeriod] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const toggleStatut = (id: string) => {
    setChambres((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
            ...c,
            statut: c.statut === "DISPONIBLE" ? "INDISPONIBLE" : "DISPONIBLE",
          }
          : c
      )
    );
  };

  const filteredBookings =
    bookingFilter === "all"
      ? recentBookings
      : recentBookings.filter(
        (b) => b.status === bookingFilter.toUpperCase()
      );

  const filteredReviews =
    reviewFilter === "all"
      ? latestReviews
      : latestReviews.filter((r) =>
        reviewFilter === "replied" ? r.reply !== null : r.reply === null
      );

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF9F7] relative overflow-hidden">
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
        className={`fixed left-0 top-0 h-full bg-charcoal z-40 transition-all duration-300 ease-in-out flex flex-col ${sidebarHovered ? "w-[240px]" : "w-[72px]"
          }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center text-white font-black text-lg shrink-0">
              H
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              <p
                className="text-white font-black text-lg whitespace-nowrap"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                HOTELHUB
              </p>
              <p className="text-white/40 text-xs whitespace-nowrap">
                Espace Directeur
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
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                    ? "bg-blue/20 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue rounded-r-full" />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                >
                  {item.label}
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
              className={`overflow-hidden transition-all duration-300 ${sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              <p className="text-white font-semibold text-sm whitespace-nowrap">
                {user?.nom ?? "Directeur"}
              </p>
              <p className="text-white/40 text-xs whitespace-nowrap">
                Directeur
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`mt-3 w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all ${sidebarHovered ? "" : "justify-center"
              }`}
          >
            <LogOut className="w-4 h-4" />
            <span
              className={`text-xs overflow-hidden transition-all duration-300 ${sidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              Deconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${sidebarHovered ? "ml-[240px]" : "ml-[72px]"
          }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF9F7]/80 backdrop-blur-md border-b border-gold/10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-black text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-charcoal/50 text-sm capitalize">
                {currentDate}
              </p>
            </div>
            <button className="relative p-3 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 transition-colors">
              <Bell className="w-5 h-5 text-charcoal" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue rounded-full" />
            </button>
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
                    label: "Total Chambres",
                    value: chambres.length,
                    trend: "+2",
                    up: true,
                    icon: BedDouble,
                  },
                  {
                    label: "Reservations Actives",
                    value: mockReservations.filter(
                      (r) => r.statut === "CONFIRMEE"
                    ).length,
                    trend: "+5",
                    up: true,
                    icon: CalendarCheck,
                  },
                  {
                    label: "Taux d'Occupation",
                    value: `${mockDirecteurHotel.tauxOccupation}%`,
                    trend: "+12%",
                    up: true,
                    icon: BarChart3,
                  },
                  {
                    label: "Note Moyenne",
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
                      className="bg-charcoal rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-xl bg-white/10">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"
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
                <div className="lg:col-span-2 bg-charcoal rounded-2xl p-6 shadow-lg">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Taux d&apos;Occupation Hebdomadaire
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
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
                          contentStyle={{
                            backgroundColor: "#1C1714",
                            border: "1px solid rgba(212,175,55,0.3)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          formatter={(value: number) => [`${value}%`, "Occupation"]}
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
                <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                  <h3
                    className="text-lg font-bold text-white mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Derniers Avis
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
                                className={`w-3 h-3 ${i < review.rating
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
                          <button className="mt-2 text-xs text-blue hover:text-blue/80 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Repondre
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="mt-4 w-full py-2 text-sm text-gold hover:text-gold/80 flex items-center justify-center gap-1 transition-colors"
                  >
                    Voir plus
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
                  Reservations Recentes
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Client
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Type de Chambre
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Arrivee
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Depart
                        </th>
                        <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.slice(0, 5).map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4 text-white font-medium">
                            {booking.guest}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.roomType}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.checkIn}
                          </td>
                          <td className="py-4 px-4 text-white/70">
                            {booking.checkOut}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_RES_STYLE[booking.status]
                                }`}
                            >
                              {STATUT_RES_LABEL[booking.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddRoom(!showAddRoom)}
                  className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue/20"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une Chambre
                </button>
              </div>

              {/* Add Room Drawer */}
              {showAddRoom && (
                <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Nouvelle Chambre
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Numero", placeholder: "101" },
                      {
                        label: "Type",
                        placeholder: "Simple, Double, Suite...",
                      },
                      { label: "Capacite (pers.)", placeholder: "2" },
                      { label: "Prix/nuit (FCFA)", placeholder: "85000" },
                      {
                        label: "Description",
                        placeholder: "Vue sur mer, climatisee...",
                      },
                      {
                        label: "Equipements",
                        placeholder: "Wifi, Clim, TV...",
                      },
                    ].map((field) => (
                      <div key={field.label} className="space-y-2">
                        <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                          {field.label}
                        </label>
                        <input
                          placeholder={field.placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button className="bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowAddRoom(false)}
                      className="text-white/50 hover:text-white px-6 py-3 rounded-xl border border-white/10 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Room Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chambres.map((room) => (
                  <div
                    key={room.id}
                    className="bg-charcoal rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          Chambre {room.numero}
                        </h4>
                        <p className="text-white/50 text-sm">
                          {room.type} - Etage {Math.floor(room.numero / 100)}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${STATUT_CHAMBRE_STYLE[room.statut]
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${room.statut === "DISPONIBLE"
                              ? "bg-gold"
                              : "bg-red-400"
                            }`}
                        />
                        {room.statut === "DISPONIBLE"
                          ? "Disponible"
                          : "Occupee"}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.equipements.map((eq) => (
                        <span
                          key={eq}
                          className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-lg"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <p
                        className="text-gold font-bold text-lg"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {room.prixParNuit.toLocaleString("fr-FR")}{" "}
                        <span className="text-white/40 text-sm font-normal">
                          FCFA/nuit
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex gap-2 bg-charcoal rounded-xl p-1.5 w-fit">
                {[
                  { id: "all", label: "Toutes" },
                  { id: "en_attente", label: "En attente" },
                  { id: "confirmee", label: "Confirmees" },
                  { id: "annulee", label: "Annulees" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setBookingFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bookingFilter === filter.id
                        ? "bg-blue text-white"
                        : "text-white/60 hover:text-white"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Bookings Table */}
              <div className="bg-charcoal rounded-2xl p-6 shadow-lg overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Chambre
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Dates
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Prix
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Statut
                      </th>
                      <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider font-semibold">
                        Actions
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
                          {booking.guest}
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {booking.roomType}
                        </td>
                        <td className="py-4 px-4 text-white/70 text-sm">
                          {booking.checkIn} - {booking.checkOut}
                        </td>
                        <td className="py-4 px-4 text-gold font-semibold">
                          185,000 FCFA
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUT_RES_STYLE[booking.status]
                              }`}
                          >
                            {STATUT_RES_LABEL[booking.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {booking.status === "EN_ATTENTE" ? (
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
                      Details de la Reservation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Client
                        </p>
                        <p className="text-white font-semibold">
                          Jean-Pierre Mbeki
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <p className="text-white/70">jp.mbeki@email.com</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Telephone
                        </p>
                        <p className="text-white/70">+237 699 123 456</p>
                      </div>
                      <div className="pt-4 border-t border-gold/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Transaction
                        </p>
                        <p className="text-gold font-semibold">
                          740,000 FCFA - Payee
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                      Fermer
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
                    { id: "all", label: "Tous" },
                    { id: "pending", label: "Sans reponse" },
                    { id: "replied", label: "Avec reponse" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setReviewFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reviewFilter === filter.id
                          ? "bg-blue text-white"
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
                  className="bg-charcoal text-white/70 px-4 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue"
                >
                  <option value="all">Toutes les periodes</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
                <select
                  className="bg-charcoal text-white/70 px-4 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue"
                >
                  <option value="">Toutes les chambres</option>
                  {chambres.map((c) => (
                    <option key={c.id} value={c.id}>
                      Chambre {c.numero}
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
                                  className={`w-4 h-4 ${i < review.rating
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
                      <div className="ml-4 pl-4 border-l-2 border-blue bg-blue/5 rounded-r-xl p-4">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">
                          Votre reponse
                        </p>
                        <p className="text-white/70">{review.reply}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          rows={3}
                          placeholder="Repondre a cet avis..."
                          value={reponses[review.id] ?? ""}
                          onChange={(e) =>
                            setReponses({
                              ...reponses,
                              [review.id]: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue transition-colors resize-none"
                        />
                        <button className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                          <Send className="w-4 h-4" />
                          Envoyer la reponse
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
                    Reservations ce mois
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
                    Recettes ce mois
                  </h3>
                  <p
                    className="text-4xl font-black text-gold"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {mockDirecteurHotel.statRecettes.toLocaleString("fr-FR")}{" "}
                    <span className="text-white/40 text-lg font-normal">
                      FCFA
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Taux d&apos;occupation
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
                  Disponibilite des Chambres
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gold/10 border border-gold/20 rounded-xl p-6 text-center">
                    <p
                      className="text-4xl font-black text-gold"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {chambres.filter((c) => c.statut === "DISPONIBLE").length}
                    </p>
                    <p className="text-gold/70 text-sm mt-2">Disponibles</p>
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
                    <p className="text-red-400/70 text-sm mt-2">Occupees</p>
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
                  Personnel de l&apos;Hotel
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
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${staff.status === "Actif"
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
              <div className="bg-charcoal rounded-2xl p-6 shadow-lg">
                <h3
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Parametres de l&apos;Hotel
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      Nom de l&apos;hotel
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.nom}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      Email de contact
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                      Telephone
                    </label>
                    <input
                      defaultValue={mockDirecteurHotel.telephone}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue transition-colors"
                    />
                  </div>
                  <button className="bg-blue hover:bg-blue/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Sauvegarder les modifications
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
