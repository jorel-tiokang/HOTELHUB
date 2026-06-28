"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore, type DirectorAccount } from "@/store/authStore";
import { useHotelsStore } from "@/store/hotelsStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useMessagesStore } from "@/store/messagesStore";
import { formatCompactPrice } from "@/utils/currency";
import { ThemeToggle } from "@/src/components/Header";
import LanguageToggle from "@/src/components/LanguageToggle";
import CurrencyToggle from "@/src/components/CurrencyToggle";
import DashboardSidebar from "@/src/components/director/shared/DashboardSidebar";
import MessagesTab from "@/src/components/shared/MessagesTab";
import {
  LayoutDashboard, Building2, Users, BarChart3, Star,
  Bell, Menu, Plus, Trash2, Edit3, X, Eye, EyeOff, Copy, Check, MapPin, ChevronDown, Search, MessageSquare
} from "lucide-react";

type Tab = "overview" | "hotels" | "directors" | "reviews" | "statistics" | "messages";

export default function DashboardPDGPage() {
  const { user, logout, directors, addDirector, removeDirector, updateDirector } = useAuthStore();
  const { hotels, updateHotel } = useHotelsStore();
  const { currency } = useCurrencyStore();
  const { getUnreadCount } = useMessagesStore();
  const locale = useLocale();
  const t = useTranslations("pdgDashboard");

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSidebarExpanded = sidebarHovered || isMobileMenuOpen;

  // Hotel filter (all or specific)
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");
  const [statsSort, setStatsSort] = useState<"name" | "revenueDesc" | "occupancy" | "bookings">("name");
  const [statsSearch, setStatsSearch] = useState("");

  // Director form state
  const [showAddDirector, setShowAddDirector] = useState(false);
  const [editingDirId, setEditingDirId] = useState<string | null>(null);
  const [newDir, setNewDir] = useState({ nom: "", email: "", motDePasse: "", sexe: "", telephone: "", telephone2: "", hotelId: "" });
  const [createdDir, setCreatedDir] = useState<DirectorAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeHotels = hotels.filter((h) => h.actif !== false);
  const filteredHotels = selectedHotelId === "all" ? activeHotels : activeHotels.filter((h) => h.id === selectedHotelId);

  const totalRevenue = filteredHotels.reduce((s, h) => s + ((h as any).statRecettes || 0), 0);
  const totalReservations = filteredHotels.reduce((s, h) => s + ((h as any).statReservations || 0), 0);
  const avgOccupancy = filteredHotels.length
    ? Math.round(filteredHotels.reduce((s, h) => s + ((h as any).tauxOccupation || 0), 0) / filteredHotels.length)
    : 0;

  // Messages Integration
  const pdgUser = { id: "u-pdg-001", name: user?.nom || "Direction Générale", role: "PDG" };
  const messageContacts = directors.map(d => ({
    id: d.id,
    name: d.nom,
    role: "Directeur",
    avatarInitial: d.nom.charAt(0)
  }));
  const unreadMessagesCount = getUnreadCount(pdgUser.id);

  const navItems = [
    { id: "overview", label: t("nav.overview"), icon: LayoutDashboard },
    { id: "hotels", label: t("nav.hotels"), icon: Building2 },
    { id: "directors", label: t("nav.directors"), icon: Users },
    { id: "statistics", label: t("nav.statistics"), icon: BarChart3 },
    { id: "reviews", label: t("nav.reviews"), icon: Star },
    { id: "messages", label: t("nav.messages"), icon: MessageSquare, unreadCount: unreadMessagesCount },
  ];
  const handleSubmitDirector = () => {
    if (!newDir.nom || !newDir.email || !newDir.motDePasse || !newDir.hotelId) return;
    
    if (editingDirId) {
      updateDirector(editingDirId, newDir);
    } else {
      const created = addDirector({ ...newDir, role: "DIRECTEUR" });
      setCreatedDir(created);
    }
    setNewDir({ nom: "", email: "", motDePasse: "", sexe: "", telephone: "", telephone2: "", hotelId: "" });
    setShowAddDirector(false);
    setEditingDirId(null);
  };

  const openAddModal = () => {
    setEditingDirId(null);
    setNewDir({ nom: "", email: "", motDePasse: "", sexe: "", telephone: "", telephone2: "", hotelId: "" });
    setShowAddDirector(false);
    setTimeout(() => setShowAddDirector(true), 0);
  };

  const openEditModal = (d: DirectorAccount) => {
    setEditingDirId(d.id);
    setNewDir({
      nom: d.nom,
      email: d.email,
      motDePasse: d.motDePasse,
      sexe: d.sexe || "",
      telephone: d.telephone || "",
      telephone2: d.telephone2 || "",
      hotelId: d.hotelId,
    });
    setShowAddDirector(true);
  };

  const cardClass = "bg-charcoal rounded-2xl p-5 shadow-lg animateCardBoxHover";
  const inputClass = "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-purple transition-all placeholder:text-foreground/40";
  const labelClass = "text-foreground/60 text-xs uppercase tracking-wider font-semibold mb-1 block";

  // Moved to top
  
  return (
    <div className="min-h-screen bg-[url('/image6.jpg')] bg-cover bg-center bg-fixed relative overflow-hidden">
      {/* Noise texture overlay to match director dashboard */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed inset-0 bg-black/60 pointer-events-none" />

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="relative z-10">
        <DashboardSidebar
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={(t) => setActiveTab(t as Tab)}
          isSidebarExpanded={isSidebarExpanded}
          setSidebarHovered={setSidebarHovered}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          userName={user?.nom}
          userInitial={user?.nom?.charAt(0) ?? "P"}
          roleLabel={t("role")}
          espaceLabel={t("espace")}
          logoutLabel={t("logout")}
          onLogout={logout}
          logoSubtitle={t("logoSubtitle")}
        />

        <main className={`transition-all duration-300 min-h-screen ${sidebarHovered ? "md:ml-[240px]" : "md:ml-[72px]"}`}>
          {/* Header */}
          <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-gold/10">
            <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {navItems.find((n) => n.id === activeTab)?.label}
                  </h1>
                  <p className="text-white/50 text-xs">{t("chainStatus", { count: activeHotels.length })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
                {/* Hotel filter */}
                <select
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="bg-charcoal border border-foreground/10 text-foreground text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-purple transition-all appearance-none cursor-pointer"
                >
                  <option value="all">{t("allHotels")}</option>
                  {activeHotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                <div className="dark flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                  <CurrencyToggle />
                </div>
                <button onClick={() => setActiveTab("messages")} className="relative p-2.5 rounded-xl bg-purple/30 hover:bg-purple/50 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-charcoal rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-8">
            {/* KPI Cards (shown on all tabs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t("kpi.activeHotels"), value: filteredHotels.length },
                { label: t("kpi.totalBookings"), value: totalReservations },
                { label: t("kpi.avgOccupancy"), value: `${avgOccupancy}%` },
                { label: t("kpi.totalRevenue"), value: formatCompactPrice(totalRevenue, currency as any, locale) },
              ].map((k) => (
                <div key={k.label} className={cardClass}>
                  <p className="text-gold text-2xl font-bold">{k.value}</p>
                  <p className="text-foreground/50 text-xs uppercase tracking-wider mt-1">{k.label}</p>
                </div>
              ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredHotels.map((h) => (
                  <div key={h.id} className={cardClass}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-foreground font-bold text-base">{h.name}</p>
                        <p className="text-foreground/50 text-sm flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-foreground/40" /> {h.city}, {h.country}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${h.actif !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {h.actif !== false ? t("hotels.active") : t("hotels.inactive")}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="bg-foreground/5 rounded-xl p-3 text-center">
                        <p className="text-foreground font-bold">{h.rooms.length}</p>
                        <p className="text-foreground/40 text-xs mt-1">{t("hotels.roomsCount")}</p>
                      </div>
                      <div className="bg-foreground/5 rounded-xl p-3 text-center">
                        <p className="text-foreground font-bold">{h.rating ?? "—"}</p>
                        <p className="text-foreground/40 text-xs mt-1">{t("hotels.rating")}</p>
                      </div>
                      <div className="bg-foreground/5 rounded-xl p-3 text-center">
                        <p className="text-foreground font-bold">{(h as any).tauxOccupation ?? "—"}%</p>
                        <p className="text-foreground/40 text-xs mt-1">{t("hotels.occupancy")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── HOTELS ── */}
            {activeTab === "hotels" && (
              <div className="space-y-4">
                {filteredHotels.map((h) => (
                  <div key={h.id} className={`${cardClass} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                    <div className="flex items-center gap-4">
                      <img src={h.image} alt={h.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div>
                        <p className="text-foreground font-bold">{h.name}</p>
                        <p className="text-foreground/50 text-sm flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-foreground/40" /> {h.city}, {h.country}
                        </p>
                        <p className="text-foreground/40 text-xs mt-1">{h.rooms.length} {t("hotels.roomsCount").toLowerCase()} · ⭐ {h.rating}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => updateHotel(h.id, { actif: !(h.actif !== false) })}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${h.actif !== false ? "border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10" : "border-red-400/30 text-red-400 hover:bg-red-500/10"}`}
                      >
                        {h.actif !== false ? t("hotels.active") : t("hotels.inactive")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── DIRECTORS ── */}
            {activeTab === "directors" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple/20"
                  >
                    <Plus className="w-4 h-4" /> {t("directors.newDirector")}
                  </button>
                </div>

                {/* Credentials shown after creation */}
                {createdDir && (
                  <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-emerald-400 font-bold text-sm">{t("directors.accountCreated")}</p>
                      <button onClick={() => setCreatedDir(null)}><X className="w-4 h-4 text-foreground/40 hover:text-foreground" /></button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-foreground/80">{t("directors.name")} : <span className="text-foreground font-semibold">{createdDir.nom}</span></p>
                      <p className="text-foreground/80">{t("directors.email")} : <span className="text-foreground font-semibold">{createdDir.email}</span></p>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground/80">{t("directors.password")} : <span className="text-foreground font-semibold">{showPassword ? createdDir.motDePasse : "••••••••"}</span></p>
                        <button onClick={() => setShowPassword(!showPassword)} className="text-foreground/40 hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(createdDir.motDePasse); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-foreground/40 hover:text-foreground">
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-foreground/80">{t("directors.assignedHotel")} : <span className="text-foreground font-semibold">{hotels.find((h) => h.id === createdDir.hotelId)?.name ?? createdDir.hotelId}</span></p>
                    </div>
                  </div>
                )}

                {/* Directors list */}
                <div className="space-y-3">
                  {directors.length === 0 && (
                    <p className="text-foreground/40 text-center py-10">{t("directors.emptyList")}</p>
                  )}
                  {directors.map((d) => (
                    <div key={d.id} className={`${cardClass} flex items-center justify-between gap-4`}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold shrink-0">
                          {d.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">{d.nom}</p>
                          <p className="text-foreground/50 text-sm">{d.email}</p>
                          <p className="text-foreground/40 text-xs mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {hotels.find((h) => h.id === d.hotelId)?.name ?? d.hotelId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(d)} className="p-2 rounded-lg border border-purple/30 hover:bg-purple/10 text-purple transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeDirector(d.id)} className="p-2 rounded-lg border border-red-400/30 hover:bg-red-500/10 text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STATISTICS ── */}
            {activeTab === "statistics" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder={t("statistics.searchPlaceholder")} 
                      value={statsSearch}
                      onChange={(e) => setStatsSearch(e.target.value)}
                      className="bg-charcoal border border-foreground/10 text-foreground text-sm pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-purple transition-all w-full sm:w-64"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-charcoal border border-foreground/10 px-3 py-1.5 rounded-xl relative self-end sm:self-auto">
                    <span className="text-foreground/50 text-xs font-semibold">{t("statistics.sortBy")}</span>
                    <select
                      value={statsSort}
                      onChange={(e) => setStatsSort(e.target.value as any)}
                      className="bg-transparent text-foreground text-sm focus:outline-none appearance-none cursor-pointer pr-6 relative z-10"
                    >
                      <option value="name" className="bg-charcoal">{t("statistics.sortName")}</option>
                      <option value="revenueDesc" className="bg-charcoal">{t("statistics.sortRevenueDesc")}</option>
                      <option value="occupancy" className="bg-charcoal">{t("statistics.sortOccupancy")}</option>
                      <option value="bookings" className="bg-charcoal">{t("statistics.sortBookings")}</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-foreground/50 absolute right-3 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...filteredHotels]
                    .filter(h => h.name.toLowerCase().includes(statsSearch.toLowerCase()) || h.city.toLowerCase().includes(statsSearch.toLowerCase()))
                    .sort((a, b) => {
                      if (statsSort === "revenueDesc") return ((b as any).statRecettes || 0) - ((a as any).statRecettes || 0);
                      if (statsSort === "occupancy") return ((b as any).tauxOccupation || 0) - ((a as any).tauxOccupation || 0);
                      if (statsSort === "bookings") return ((b as any).statReservations || 0) - ((a as any).statReservations || 0);
                      return a.name.localeCompare(b.name);
                    })
                    .map((h) => (
                      <div key={h.id} className={cardClass}>
                        <p className="text-foreground font-bold mb-1">{h.name}</p>
                        <p className="text-foreground/40 text-xs mb-4 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {h.city}
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t("statistics.bookings")}</p>
                            <p className="text-gold text-xl font-bold">{(h as any).statReservations ?? "—"}</p>
                          </div>
                          <div>
                            <p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t("statistics.revenue")}</p>
                            <p className="text-gold text-xl font-bold">{formatCompactPrice((h as any).statRecettes ?? 0, currency as any, locale)}</p>
                          </div>
                          <div>
                            <p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t("statistics.occupancy")}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gold rounded-full" style={{ width: `${(h as any).tauxOccupation ?? 0}%` }} />
                              </div>
                              <span className="text-foreground text-sm font-semibold">{(h as any).tauxOccupation ?? 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ── REVIEWS ── */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {filteredHotels.flatMap((h) =>
                  (h as any).avis?.map((a: any) => (
                    <div key={a.id} className={cardClass}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-purple/20 text-purple px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {h.name}
                        </span>
                        <span className="text-foreground/40 text-xs">{a.dateDepot}</span>
                      </div>
                      <p className="text-foreground/80 text-sm">"{a.texte}"</p>
                    </div>
                  )) ?? []
                )}
                {filteredHotels.every((h) => !(h as any).avis?.length) && (
                  <p className="text-foreground/40 text-center py-10">{t("reviews.empty")}</p>
                )}
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === "messages" && (
              <MessagesTab currentUser={pdgUser} contacts={messageContacts} t={t} />
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Director Modal */}
      {showAddDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-charcoal border border-foreground/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-foreground font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                {editingDirId ? t("directors.editTitle") : t("directors.modalTitle")}
              </h3>
              <button onClick={() => setShowAddDirector(false)} className="text-foreground/40 hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>{t("directors.form.fullName")}</label><input value={newDir.nom} onChange={(e) => setNewDir({ ...newDir, nom: e.target.value })} className={inputClass} placeholder="Jean Dupont" /></div>
              <div><label className={labelClass}>{t("directors.form.email")}</label><input type="email" value={newDir.email} onChange={(e) => setNewDir({ ...newDir, email: e.target.value })} className={inputClass} placeholder="directeur@hotel.com" /></div>
              <div><label className={labelClass}>{t("directors.form.password")}</label><input type="text" value={newDir.motDePasse} onChange={(e) => setNewDir({ ...newDir, motDePasse: e.target.value })} className={inputClass} placeholder="Mot de passe temporaire" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{t("directors.form.gender")}</label>
                  <select value={newDir.sexe} onChange={(e) => setNewDir({ ...newDir, sexe: e.target.value })} className={`${inputClass} appearance-none`}>
                    <option value="">{t("directors.form.select")}</option>
                    <option value="M">{t("directors.form.male")}</option>
                    <option value="F">{t("directors.form.female")}</option>
                    <option value="A">{t("directors.form.other")}</option>
                  </select>
                </div>
                <div><label className={labelClass}>{t("directors.form.assignedHotel")}</label>
                  <select value={newDir.hotelId} onChange={(e) => setNewDir({ ...newDir, hotelId: e.target.value })} className={`${inputClass} appearance-none`}>
                    <option value="">{t("directors.form.select")}</option>
                    {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{t("directors.form.phone1")}</label><input value={newDir.telephone} onChange={(e) => setNewDir({ ...newDir, telephone: e.target.value })} className={inputClass} placeholder="+237 6xx xxx xxx" /></div>
                <div><label className={labelClass}>{t("directors.form.phone2")}</label><input value={newDir.telephone2} onChange={(e) => setNewDir({ ...newDir, telephone2: e.target.value })} className={inputClass} placeholder="+237 6xx xxx xxx" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitDirector}
                disabled={!newDir.nom || !newDir.email || !newDir.motDePasse || !newDir.hotelId}
                className="flex-1 bg-purple hover:bg-purple/90 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all"
              >
                {editingDirId ? t("directors.update") : t("directors.create")}
              </button>
              <button onClick={() => setShowAddDirector(false)} className="px-5 py-3 border border-foreground/20 text-foreground/60 hover:text-foreground rounded-xl transition-all">
                {t("directors.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
