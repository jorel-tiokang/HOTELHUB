"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore, type DirectorAccount } from "@/store/authStore";
import { useHotelsStore } from "@/store/hotelsStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatCompactPrice } from "@/utils/currency";
import { ThemeToggle } from "@/src/components/Header";
import LanguageToggle from "@/src/components/LanguageToggle";
import CurrencyToggle from "@/src/components/CurrencyToggle";
import DashboardSidebar from "@/src/components/director/shared/DashboardSidebar";
import {
  LayoutDashboard, Building2, Users, BarChart3, Star,
  Bell, Menu, Plus, Trash2, Edit3, X, Eye, EyeOff, Copy, Check,
} from "lucide-react";

type Tab = "overview" | "hotels" | "directors" | "reviews" | "statistics";

export default function DashboardPDGPage() {
  const { user, logout, directors, addDirector, removeDirector } = useAuthStore();
  const { hotels, updateHotel } = useHotelsStore();
  const { currency } = useCurrencyStore();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSidebarExpanded = sidebarHovered || isMobileMenuOpen;

  // Hotel filter (all or specific)
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");

  // Director form state
  const [showAddDirector, setShowAddDirector] = useState(false);
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

  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "hotels", label: "Portefeuille", icon: Building2 },
    { id: "directors", label: "Directeurs", icon: Users },
    { id: "statistics", label: "Statistiques", icon: BarChart3 },
    { id: "reviews", label: "Avis", icon: Star },
  ];

  const handleCreateDirector = () => {
    if (!newDir.nom || !newDir.email || !newDir.motDePasse || !newDir.hotelId) return;
    const created = addDirector({ ...newDir, role: "DIRECTEUR" });
    setCreatedDir(created);
    setNewDir({ nom: "", email: "", motDePasse: "", sexe: "", telephone: "", telephone2: "", hotelId: "" });
    setShowAddDirector(false);
  };

  const cardClass = "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg";
  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple transition-all placeholder:text-white/40";
  const labelClass = "text-white/60 text-xs uppercase tracking-wider font-semibold mb-1 block";

  return (
    <div className="min-h-screen bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed relative">
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
          roleLabel="PDG"
          espaceLabel="Espace Direction Générale"
          logoutLabel="Déconnexion"
          onLogout={logout}
          logoSubtitle="Direction Générale"
        />

        <main className={`transition-all duration-300 min-h-screen ${sidebarHovered ? "md:ml-[240px]" : "md:ml-[72px]"}`}>
          {/* Header */}
          <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-white/10">
            <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {navItems.find((n) => n.id === activeTab)?.label}
                  </h1>
                  <p className="text-white/50 text-xs">Chaîne HotelHub · {activeHotels.length} établissements actifs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
                {/* Hotel filter */}
                <select
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-purple transition-all appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">Tous les hôtels</option>
                  {activeHotels.map((h) => (
                    <option key={h.id} value={h.id} className="bg-gray-900">{h.name}</option>
                  ))}
                </select>
                <div className="dark flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                  <CurrencyToggle />
                </div>
                <button className="relative p-2.5 rounded-xl bg-purple/30 hover:bg-purple/50 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 space-y-8">
            {/* KPI Cards (shown on all tabs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Hôtels actifs", value: filteredHotels.length },
                { label: "Réservations totales", value: totalReservations },
                { label: "Taux moyen d'occupation", value: `${avgOccupancy}%` },
                { label: "Recettes totales", value: formatCompactPrice(totalRevenue, currency, locale) },
              ].map((k) => (
                <div key={k.label} className={cardClass}>
                  <p className="text-white text-2xl font-bold">{k.value}</p>
                  <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{k.label}</p>
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
                        <p className="text-white font-bold text-base">{h.name}</p>
                        <p className="text-white/50 text-sm">📍 {h.city}, {h.country}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${h.actif !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {h.actif !== false ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-white font-bold">{h.rooms.length}</p>
                        <p className="text-white/40 text-xs mt-1">Chambres</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-white font-bold">{h.rating ?? "—"}</p>
                        <p className="text-white/40 text-xs mt-1">Note</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-white font-bold">{(h as any).tauxOccupation ?? "—"}%</p>
                        <p className="text-white/40 text-xs mt-1">Occupation</p>
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
                        <p className="text-white font-bold">{h.name}</p>
                        <p className="text-white/50 text-sm">📍 {h.city}, {h.country}</p>
                        <p className="text-white/40 text-xs mt-1">{h.rooms.length} chambres · ⭐ {h.rating}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => updateHotel(h.id, { actif: !(h.actif !== false) })}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${h.actif !== false ? "border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10" : "border-red-400/30 text-red-400 hover:bg-red-500/10"}`}
                      >
                        {h.actif !== false ? "Actif" : "Inactif"}
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
                    onClick={() => setShowAddDirector(true)}
                    className="flex items-center gap-2 bg-purple hover:bg-purple/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple/20"
                  >
                    <Plus className="w-4 h-4" /> Nouveau Directeur
                  </button>
                </div>

                {/* Credentials shown after creation */}
                {createdDir && (
                  <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-emerald-400 font-bold text-sm">✅ Compte créé — Identifiants à transmettre :</p>
                      <button onClick={() => setCreatedDir(null)}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/80">Nom : <span className="text-white font-semibold">{createdDir.nom}</span></p>
                      <p className="text-white/80">Email : <span className="text-white font-semibold">{createdDir.email}</span></p>
                      <div className="flex items-center gap-2">
                        <p className="text-white/80">Mot de passe : <span className="text-white font-semibold">{showPassword ? createdDir.motDePasse : "••••••••"}</span></p>
                        <button onClick={() => setShowPassword(!showPassword)} className="text-white/40 hover:text-white">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(createdDir.motDePasse); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-white/40 hover:text-white">
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-white/80">Hôtel : <span className="text-white font-semibold">{hotels.find((h) => h.id === createdDir.hotelId)?.name ?? createdDir.hotelId}</span></p>
                    </div>
                  </div>
                )}

                {/* Directors list */}
                <div className="space-y-3">
                  {directors.length === 0 && (
                    <p className="text-white/40 text-center py-10">Aucun directeur créé. Cliquez sur &quot;Nouveau Directeur&quot; pour commencer.</p>
                  )}
                  {directors.map((d) => (
                    <div key={d.id} className={`${cardClass} flex items-center justify-between gap-4`}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold shrink-0">
                          {d.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{d.nom}</p>
                          <p className="text-white/50 text-sm">{d.email}</p>
                          <p className="text-white/40 text-xs mt-0.5">🏨 {hotels.find((h) => h.id === d.hotelId)?.name ?? d.hotelId}</p>
                        </div>
                      </div>
                      <button onClick={() => removeDirector(d.id)} className="p-2 rounded-lg border border-red-400/30 hover:bg-red-500/10 text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STATISTICS ── */}
            {activeTab === "statistics" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHotels.map((h) => (
                  <div key={h.id} className={cardClass}>
                    <p className="text-white font-bold mb-1">{h.name}</p>
                    <p className="text-white/40 text-xs mb-4">📍 {h.city}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Réservations</p>
                        <p className="text-white text-xl font-bold">{(h as any).statReservations ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Recettes</p>
                        <p className="text-white text-xl font-bold">{formatCompactPrice((h as any).statRecettes ?? 0, currency, locale)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Occupation</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full" style={{ width: `${(h as any).tauxOccupation ?? 0}%` }} />
                          </div>
                          <span className="text-white text-sm font-semibold">{(h as any).tauxOccupation ?? 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── REVIEWS ── */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {filteredHotels.flatMap((h) =>
                  (h as any).avis?.map((a: any) => (
                    <div key={a.id} className={cardClass}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-purple/20 text-purple px-2.5 py-0.5 rounded-full font-semibold">🏨 {h.name}</span>
                        <span className="text-white/40 text-xs">{a.dateDepot}</span>
                      </div>
                      <p className="text-white/80 text-sm">"{a.texte}"</p>
                    </div>
                  )) ?? []
                )}
                {filteredHotels.every((h) => !(h as any).avis?.length) && (
                  <p className="text-white/40 text-center py-10">Aucun avis disponible pour la sélection en cours.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Director Modal */}
      {showAddDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1c1714] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Nouveau Directeur</h3>
              <button onClick={() => setShowAddDirector(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Nom complet *</label><input value={newDir.nom} onChange={(e) => setNewDir({ ...newDir, nom: e.target.value })} className={inputClass} placeholder="Jean Dupont" /></div>
              <div><label className={labelClass}>Email * (utilisé pour la connexion)</label><input type="email" value={newDir.email} onChange={(e) => setNewDir({ ...newDir, email: e.target.value })} className={inputClass} placeholder="directeur@hotel.com" /></div>
              <div><label className={labelClass}>Mot de passe *</label><input type="text" value={newDir.motDePasse} onChange={(e) => setNewDir({ ...newDir, motDePasse: e.target.value })} className={inputClass} placeholder="Mot de passe temporaire" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Sexe *</label>
                  <select value={newDir.sexe} onChange={(e) => setNewDir({ ...newDir, sexe: e.target.value })} className={`${inputClass} appearance-none`}>
                    <option value="" className="bg-gray-900">Choisir</option>
                    <option value="M" className="bg-gray-900">Homme</option>
                    <option value="F" className="bg-gray-900">Femme</option>
                    <option value="A" className="bg-gray-900">Autre</option>
                  </select>
                </div>
                <div><label className={labelClass}>Hôtel assigné *</label>
                  <select value={newDir.hotelId} onChange={(e) => setNewDir({ ...newDir, hotelId: e.target.value })} className={`${inputClass} appearance-none`}>
                    <option value="" className="bg-gray-900">Choisir</option>
                    {hotels.map((h) => <option key={h.id} value={h.id} className="bg-gray-900">{h.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Téléphone (opt.)</label><input value={newDir.telephone} onChange={(e) => setNewDir({ ...newDir, telephone: e.target.value })} className={inputClass} placeholder="+237 6xx xxx xxx" /></div>
                <div><label className={labelClass}>Tél. 2 (opt.)</label><input value={newDir.telephone2} onChange={(e) => setNewDir({ ...newDir, telephone2: e.target.value })} className={inputClass} placeholder="+237 6xx xxx xxx" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateDirector}
                disabled={!newDir.nom || !newDir.email || !newDir.motDePasse || !newDir.hotelId}
                className="flex-1 bg-purple hover:bg-purple/90 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Créer le compte
              </button>
              <button onClick={() => setShowAddDirector(false)} className="px-5 py-3 border border-white/20 text-white/60 hover:text-white rounded-xl transition-all">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
