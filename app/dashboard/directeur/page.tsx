"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Star,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  mockChambres,
  mockReservations,
  mockAvis,
  mockDirecteurHotel,
} from "@/mocks/dashboardMocks";

// ─── Extended mock data ──────────────────────────────────────────────────────

const weeklyOccupancy = [
  { day: "Lun", rate: 62 },
  { day: "Mar", rate: 75 },
  { day: "Mer", rate: 58 },
  { day: "Jeu", rate: 80 },
  { day: "Ven", rate: 91 },
  { day: "Sam", rate: 95 },
  { day: "Dim", rate: 70 },
];

const extendedReservations = [
  { id: "R001", guest: "Jean-Paul Essomba", room: "Suite Présidentielle", checkIn: "2026-05-10", checkOut: "2026-05-14", price: 740000, status: "CONFIRMEE" },
  { id: "R002", guest: "Marie Ngo Bassa", room: "Chambre Standard", checkIn: "2026-06-01", checkOut: "2026-06-03", price: 110000, status: "EN_ATTENTE" },
  { id: "R003", guest: "Paul Atangana", room: "Junior Suite", checkIn: "2026-04-01", checkOut: "2026-04-05", price: 360000, status: "ANNULEE" },
  { id: "R004", guest: "Christelle Mballa", room: "Chambre Double", checkIn: "2026-05-20", checkOut: "2026-05-22", price: 170000, status: "CONFIRMEE" },
  { id: "R005", guest: "Boris Tchatchou", room: "Suite Deluxe", checkIn: "2026-06-15", checkOut: "2026-06-18", price: 520000, status: "EN_ATTENTE" },
];

const staffList = [
  { id: "S001", name: "Amina Fouda", role: "Réceptionniste", contact: "+237 677 001 001", status: "ACTIF" },
  { id: "S002", name: "Roger Bekono", role: "Chef Cuisinier", contact: "+237 677 002 002", status: "ACTIF" },
  { id: "S003", name: "Élise Nkemeli", role: "Gouvernante", contact: "+237 677 003 003", status: "INACTIF" },
  { id: "S004", name: "Thierry Owona", role: "Barman", contact: "+237 677 004 004", status: "ACTIF" },
];

const extendedReviews = [
  { id: "V001", guest: "Jean-Paul Essomba", rating: 5, date: "2026-04-06", text: "Séjour exceptionnel, le personnel est aux petits soins. Je reviendrai sans hésiter.", reply: null },
  { id: "V002", guest: "Marie Ngo Bassa", rating: 3, date: "2026-04-10", text: "Chambre propre mais la climatisation était bruyante. Vue magnifique cependant.", reply: "Merci pour votre retour. Nous avons pris note et remplacé l'unité climatisation." },
  { id: "V003", guest: "Christelle Mballa", rating: 4, date: "2026-05-01", text: "Hôtel très agréable, petit-déjeuner excellent. Quelques détails d'entretien à améliorer.", reply: null },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type NavSection = "overview" | "rooms" | "bookings" | "reviews" | "staff" | "settings";
type BookingFilter = "ALL" | "CONFIRMEE" | "EN_ATTENTE" | "ANNULEE";

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_BOOKING: Record<string, { label: string; cls: string }> = {
  CONFIRMEE: { label: "Confirmée", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25" },
  EN_ATTENTE: { label: "En attente", cls: "bg-amber-500/15 text-amber-300 border-amber-400/25" },
  ANNULEE: { label: "Annulée", cls: "bg-red-500/15 text-red-300 border-red-400/25" },
};

const STATUS_ROOM: Record<string, { label: string; dot: string }> = {
  DISPONIBLE: { label: "Disponible", dot: "bg-[#D4AF37]" },
  INDISPONIBLE: { label: "Occupée", dot: "bg-[#4B2D6E]" },
  MAINTENANCE: { label: "Maintenance", dot: "bg-red-500" },
};

// ─── Custom Tooltip for Recharts ─────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-xl px-4 py-2.5 text-sm shadow-xl">
        <p className="text-[#F5EFE6]/60 mb-0.5 font-sans">{label}</p>
        <p className="text-[#D4AF37] font-bold font-sans">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardDirecteurPage() {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chambres, setChambres] = useState(mockChambres);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("ALL");
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState(extendedReviews);
  const [reservations, setReservations] = useState(extendedReservations);

  const toggleStatut = (id: string) => {
    setChambres((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, statut: c.statut === "DISPONIBLE" ? "INDISPONIBLE" : "DISPONIBLE" }
          : c
      )
    );
  };

  const submitReply = (id: string) => {
    if (!replies[id]?.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replies[id] } : r))
    );
    setReplies((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleBookingAction = (id: string, action: "accept" | "reject") => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action === "accept" ? "CONFIRMEE" : "ANNULEE" }
          : r
      )
    );
  };

  const filteredBookings =
    bookingFilter === "ALL"
      ? reservations
      : reservations.filter((r) => r.status === bookingFilter);

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: <LayoutDashboard size={18} /> },
    { id: "rooms", label: "Chambres", icon: <BedDouble size={18} /> },
    { id: "bookings", label: "Réservations", icon: <CalendarCheck size={18} /> },
    { id: "reviews", label: "Avis", icon: <Star size={18} /> },
    { id: "staff", label: "Personnel", icon: <Users size={18} /> },
    { id: "settings", label: "Paramètres", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0F0C0E] flex font-sans relative overflow-hidden">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full z-30 w-60 bg-[#120F0D] border-r border-[#D4AF37]/10
            flex flex-col transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-auto
          `}
        >
          {/* Logo */}
          <div className="px-6 pt-7 pb-6 border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
                <span className="font-serif text-[#0F0C0E] font-bold text-base">H</span>
              </div>
              <div>
                <p className="font-serif text-[#F5EFE6] font-bold text-lg leading-none tracking-wide">
                  HotelHub
                </p>
                <p className="text-[#F5EFE6]/30 text-[10px] mt-0.5 uppercase tracking-widest">
                  {mockDirecteurHotel.nom}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-5 px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                    ${isActive
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                      : "text-[#F5EFE6]/45 hover:text-[#F5EFE6]/80 hover:bg-white/5 border-l-2 border-transparent"
                    }
                  `}
                >
                  <span className={isActive ? "text-[#D4AF37]" : "text-[#F5EFE6]/35"}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Director profile */}
          <div className="px-4 py-5 border-t border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4B2D6E]/60 border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                <span className="font-serif text-[#D4AF37] text-sm font-bold">
                  {(user?.nom ?? "D").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#F5EFE6] text-sm font-semibold truncate">{user?.nom ?? "Directeur"}</p>
                <p className="text-[#F5EFE6]/30 text-[10px] uppercase tracking-widest">Directeur</p>
              </div>
              <button
                onClick={logout}
                title="Déconnexion"
                className="text-[#F5EFE6]/30 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>
      </>

      {/* ── Main ── */}
      <main className="flex-1 min-h-screen flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#0F0C0E]/90 backdrop-blur-md border-b border-[#D4AF37]/10 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#F5EFE6]/50 hover:text-[#F5EFE6]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1 className="font-serif text-[#F5EFE6] text-xl font-bold hidden sm:block">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#1C1714] border border-[#D4AF37]/15 rounded-xl px-4 py-2">
              <Search size={15} className="text-[#F5EFE6]/30" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent text-[#F5EFE6]/80 placeholder-[#F5EFE6]/25 text-sm outline-none w-40"
              />
            </div>
            <button className="relative w-9 h-9 rounded-xl bg-[#1C1714] border border-[#D4AF37]/15 flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4AF37] transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37]" />
            </button>
            <span className="hidden lg:block text-[#F5EFE6]/30 text-xs border border-[#D4AF37]/10 bg-[#1C1714] px-3 py-2 rounded-xl">
              {new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">

          {/* ── OVERVIEW ── */}
          {activeSection === "overview" && (
            <div className="flex flex-col gap-8">
              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Chambres",
                    value: chambres.length,
                    icon: <BedDouble size={20} />,
                    trend: "+2",
                    up: true,
                  },
                  {
                    label: "Réservations actives",
                    value: reservations.filter((r) => r.status === "CONFIRMEE").length,
                    icon: <CalendarCheck size={20} />,
                    trend: "+5",
                    up: true,
                  },
                  {
                    label: "Taux d'occupation",
                    value: `${mockDirecteurHotel.tauxOccupation}%`,
                    icon: <TrendingUp size={20} />,
                    trend: "-3%",
                    up: false,
                  },
                  {
                    label: "Note moyenne",
                    value: "4.2 ★",
                    icon: <Star size={20} />,
                    trend: "+0.3",
                    up: true,
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-[#1C1714] border border-[#D4AF37]/12 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-[0_0_24px_rgba(212,175,55,0.08)] transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#F5EFE6]/30">{kpi.icon}</span>
                      <span
                        className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {kpi.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#D4AF37] text-3xl font-bold font-serif">{kpi.value}</p>
                      <p className="text-[#F5EFE6]/40 text-xs uppercase tracking-widest mt-1">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gold divider */}
              <div className="h-px bg-[#D4AF37]/10" />

              {/* Chart + Recent bookings */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Bar chart */}
                <div className="xl:col-span-3 bg-[#1C1714] border border-[#D4AF37]/12 rounded-2xl p-6">
                  <p className="font-serif text-[#F5EFE6] font-semibold text-base mb-1">
                    Occupation hebdomadaire
                  </p>
                  <p className="text-[#F5EFE6]/35 text-xs mb-5">Taux d'occupation par jour cette semaine</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyOccupancy} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3715" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#F5EFE660", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#F5EFE640", fontSize: 11, fontFamily: "DM Sans, sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#D4AF3708" }} />
                      <Bar dataKey="rate" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Latest reviews */}
                <div className="xl:col-span-2 bg-[#1C1714] border border-[#D4AF37]/12 rounded-2xl p-6 flex flex-col gap-4">
                  <p className="font-serif text-[#F5EFE6] font-semibold text-base">
                    Derniers avis
                  </p>
                  {reviews.slice(0, 3).map((rev) => (
                    <div key={rev.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#F5EFE6] text-sm font-semibold">{rev.guest}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < rev.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#F5EFE6]/15"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#F5EFE6]/50 text-xs leading-relaxed line-clamp-2">
                        &ldquo;{rev.text}&rdquo;
                      </p>
                      <button
                        onClick={() => setActiveSection("reviews")}
                        className="self-start text-[#D4AF37] text-xs font-semibold hover:underline flex items-center gap-1"
                      >
                        Répondre <ChevronRight size={12} />
                      </button>
                      <div className="h-px bg-[#D4AF37]/8 mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent bookings table */}
              <div className="bg-[#1C1714] border border-[#D4AF37]/12 rounded-2xl p-6">
                <p className="font-serif text-[#F5EFE6] font-semibold text-base mb-4">
                  Réservations récentes
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[580px]">
                    <thead>
                      <tr className="border-b border-[#D4AF37]/10">
                        {["Client", "Chambre", "Arrivée", "Départ", "Statut"].map((h) => (
                          <th key={h} className="text-[#F5EFE6]/35 text-xs uppercase tracking-widest font-semibold text-left pb-3 pr-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 5).map((r) => (
                        <tr key={r.id} className="border-b border-[#D4AF37]/6 last:border-0">
                          <td className="py-3 pr-4 text-[#F5EFE6]/85 font-medium">{r.guest}</td>
                          <td className="py-3 pr-4 text-[#F5EFE6]/55">{r.room}</td>
                          <td className="py-3 pr-4 text-[#F5EFE6]/55">{r.checkIn}</td>
                          <td className="py-3 pr-4 text-[#F5EFE6]/55">{r.checkOut}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUS_BOOKING[r.status].cls}`}>
                              {STATUS_BOOKING[r.status].label}
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

          {/* ── ROOMS ── */}
          {activeSection === "rooms" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className="text-[#F5EFE6]/50 text-sm">{chambres.length} chambres enregistrées</p>
                <button
                  onClick={() => setShowAddRoom(true)}
                  className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a52e] text-[#0F0C0E] text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#D4AF37]/15"
                >
                  <Plus size={16} /> Ajouter une chambre
                </button>
              </div>

              {/* Add room drawer */}
              {showAddRoom && (
                <div className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-serif text-[#F5EFE6] font-bold text-base">Nouvelle chambre</p>
                    <button onClick={() => setShowAddRoom(false)} className="text-[#F5EFE6]/30 hover:text-[#F5EFE6]">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Numéro", placeholder: "101" },
                      { label: "Type", placeholder: "Suite, Double..." },
                      { label: "Capacité", placeholder: "2 personnes" },
                      { label: "Prix / nuit (FCFA)", placeholder: "85 000" },
                      { label: "Description", placeholder: "Vue sur mer..." },
                      { label: "Équipements", placeholder: "Wifi, Clim, TV..." },
                    ].map((f) => (
                      <div key={f.label} className="flex flex-col gap-1.5">
                        <label className="text-[#F5EFE6]/40 text-[11px] uppercase tracking-widest font-semibold">
                          {f.label}
                        </label>
                        <input
                          placeholder={f.placeholder}
                          className="bg-[#0F0C0E]/60 border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 text-[#F5EFE6]/85 placeholder-[#F5EFE6]/20 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button className="bg-[#D4AF37] hover:bg-[#c9a52e] text-[#0F0C0E] text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowAddRoom(false)}
                      className="text-[#F5EFE6]/50 hover:text-[#F5EFE6] text-sm px-4 py-2.5 rounded-xl border border-[#D4AF37]/15 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Room grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {chambres.map((c) => {
                  const st = STATUS_ROOM[c.statut] ?? STATUS_ROOM.DISPONIBLE;
                  return (
                    <div
                      key={c.id}
                      className="bg-[#1C1714] border border-[#D4AF37]/10 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.07)] transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-serif text-[#F5EFE6] font-bold text-base">
                            Chambre {c.numero}
                          </p>
                          <p className="text-[#F5EFE6]/40 text-xs mt-0.5">{c.type} · Étage {Math.floor(c.numero / 100)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                          <span className="text-[#F5EFE6]/55 text-xs">{st.label}</span>
                        </div>
                      </div>
                      <p className="text-[#F5EFE6]/50 text-xs leading-relaxed">{c.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.equipements.map((eq) => (
                          <span key={eq} className="text-[11px] bg-[#4B2D6E]/30 text-[#D4AF37]/70 border border-[#4B2D6E]/40 px-2.5 py-0.5 rounded-full">
                            {eq}
                          </span>
                        ))}
                      </div>
                      <div className="h-px bg-[#D4AF37]/8" />
                      <div className="flex items-center justify-between">
                        <p className="text-[#D4AF37] font-bold text-sm">
                          {c.prixParNuit.toLocaleString("fr-FR")}{" "}
                          <span className="text-[#F5EFE6]/35 font-normal text-xs">FCFA/nuit</span>
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleStatut(c.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-all"
                          >
                            {c.statut === "DISPONIBLE" ? "Marquer occupée" : "Libérer"}
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-[#D4AF37]/15 text-[#F5EFE6]/40 hover:text-[#D4AF37] flex items-center justify-center transition-all">
                            <Edit2 size={13} />
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-red-500/15 text-[#F5EFE6]/30 hover:text-red-400 flex items-center justify-center transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {activeSection === "bookings" && (
            <div className="flex flex-col gap-6">
              {/* Filter tabs */}
              <div className="flex gap-2 bg-[#1C1714] border border-[#D4AF37]/10 rounded-2xl p-1.5 w-fit flex-wrap">
                {(["ALL", "CONFIRMEE", "EN_ATTENTE", "ANNULEE"] as BookingFilter[]).map((f) => {
                  const labels: Record<BookingFilter, string> = {
                    ALL: "Toutes",
                    CONFIRMEE: "Confirmées",
                    EN_ATTENTE: "En attente",
                    ANNULEE: "Annulées",
                  };
                  return (
                    <button
                      key={f}
                      onClick={() => setBookingFilter(f)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        bookingFilter === f
                          ? "bg-[#D4AF37] text-[#0F0C0E]"
                          : "text-[#F5EFE6]/45 hover:text-[#F5EFE6]/75"
                      }`}
                    >
                      {labels[f]}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                {filteredBookings.map((r) => (
                  <div
                    key={r.id}
                    className="bg-[#1C1714] border border-[#D4AF37]/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-serif text-[#F5EFE6] font-semibold">{r.guest}</span>
                        <span className="text-[#F5EFE6]/35 text-xs">#{r.id}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUS_BOOKING[r.status].cls}`}>
                          {STATUS_BOOKING[r.status].label}
                        </span>
                      </div>
                      <p className="text-[#F5EFE6]/45 text-xs">{r.room} · {r.checkIn} → {r.checkOut}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[#D4AF37] font-bold text-sm whitespace-nowrap">
                        {r.price.toLocaleString("fr-FR")} <span className="text-[#F5EFE6]/35 font-normal text-xs">FCFA</span>
                      </span>
                      {r.status === "EN_ATTENTE" && (
                        <>
                          <button
                            onClick={() => handleBookingAction(r.id, "accept")}
                            className="flex items-center gap-1.5 text-xs font-bold bg-[#D4AF37] text-[#0F0C0E] px-3 py-1.5 rounded-xl hover:bg-[#c9a52e] transition-all"
                          >
                            <CheckCircle size={13} /> Accepter
                          </button>
                          <button
                            onClick={() => handleBookingAction(r.id, "reject")}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-400 border border-red-400/30 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all"
                          >
                            <XCircle size={13} /> Rejeter
                          </button>
                        </>
                      )}
                      {r.status === "CONFIRMEE" && (
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#F5EFE6]/60 border border-[#D4AF37]/15 px-3 py-1.5 rounded-xl hover:text-[#F5EFE6] transition-all">
                          <Eye size={13} /> Voir
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredBookings.length === 0 && (
                  <p className="text-[#F5EFE6]/30 text-sm text-center py-10">Aucune réservation pour ce filtre.</p>
                )}
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeSection === "reviews" && (
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#1C1714] border border-[#D4AF37]/10 rounded-2xl p-6 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-serif text-[#F5EFE6] font-semibold">{rev.guest}</p>
                      <p className="text-[#F5EFE6]/30 text-xs mt-0.5">{rev.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#F5EFE6]/15"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#F5EFE6]/70 text-sm leading-relaxed">
                    &ldquo;{rev.text}&rdquo;
                  </p>

                  {rev.reply ? (
                    <div className="border-l-2 border-[#4B2D6E] pl-4 bg-[#4B2D6E]/10 py-3 pr-4 rounded-r-xl">
                      <p className="text-[#F5EFE6]/35 text-[11px] uppercase tracking-widest font-semibold mb-1">
                        Votre réponse
                      </p>
                      <p className="text-[#F5EFE6]/70 text-sm leading-relaxed">{rev.reply}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={2}
                        placeholder="Écrire une réponse..."
                        value={replies[rev.id] ?? ""}
                        onChange={(e) => setReplies({ ...replies, [rev.id]: e.target.value })}
                        className="bg-[#0F0C0E]/60 border border-[#D4AF37]/15 rounded-xl px-4 py-3 text-[#F5EFE6]/80 placeholder-[#F5EFE6]/20 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all resize-none"
                      />
                      <button
                        onClick={() => submitReply(rev.id)}
                        className="self-end flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a52e] text-[#0F0C0E] text-xs font-bold px-4 py-2 rounded-xl transition-all"
                      >
                        <Send size={12} /> Envoyer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── STAFF ── */}
          {activeSection === "staff" && (
            <div className="flex flex-col gap-4">
              {staffList.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#1C1714] border border-[#D4AF37]/10 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#4B2D6E]/50 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <span className="font-serif text-[#D4AF37] font-bold">{s.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-serif text-[#F5EFE6] font-semibold">{s.name}</p>
                      <p className="text-[#F5EFE6]/40 text-xs">{s.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[#F5EFE6]/45 text-xs hidden sm:block">{s.contact}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                        s.status === "ACTIF"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/25"
                          : "bg-[#F5EFE6]/5 text-[#F5EFE6]/35 border-[#F5EFE6]/10"
                      }`}
                    >
                      {s.status === "ACTIF" ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeSection === "settings" && (
            <div className="max-w-lg flex flex-col gap-6">
              <div className="bg-[#1C1714] border border-[#D4AF37]/12 rounded-2xl p-6 flex flex-col gap-5">
                <p className="font-serif text-[#F5EFE6] font-bold text-base">Profil de l&apos;hôtel</p>
                {[
                  { label: "Nom de l'hôtel", value: mockDirecteurHotel.nom },
                  { label: "Localisation", value: mockDirecteurHotel.localisation },
                  { label: "Email", value: mockDirecteurHotel.email },
                  { label: "Téléphone", value: mockDirecteurHotel.telephone },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <label className="text-[#F5EFE6]/35 text-[11px] uppercase tracking-widest font-semibold">
                      {f.label}
                    </label>
                    <input
                      defaultValue={f.value}
                      className="bg-[#0F0C0E]/60 border border-[#D4AF37]/15 rounded-xl px-4 py-2.5 text-[#F5EFE6]/80 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all"
                    />
                  </div>
                ))}
                <button className="self-start bg-[#D4AF37] hover:bg-[#c9a52e] text-[#0F0C0E] text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                  Sauvegarder
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
