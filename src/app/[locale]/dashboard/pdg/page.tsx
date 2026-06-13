"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { mockHotels, mockReservations, mockAvis } from "@/mocks/dashboardMocks";

type Tab = "hotels" | "reservations" | "avis" | "stats";

const STATUT_STYLE: Record<string, string> = {
  CONFIRMEE: "bg-green-500/20 text-green-300 border-green-400/30",
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  ANNULEE: "bg-red-500/20 text-red-300 border-red-400/30",
};
const STATUT_LABEL: Record<string, string> = {
  CONFIRMEE: "Confirmée",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulée",
};

export default function DashboardPDGPage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>("hotels");
  const [showAddHotel, setShowAddHotel] = useState(false);

  const totalRecettes = mockHotels.reduce((s, h) => s + h.statRecettes, 0);
  const totalReservations = mockHotels.reduce((s, h) => s + h.statReservations, 0);
  const tauxMoyen = Math.round(mockHotels.reduce((s, h) => s + h.tauxOccupation, 0) / mockHotels.length);

  return (
    <div className="min-h-screen w-full bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--blue)] flex items-center justify-center text-white font-bold text-lg">H</div>
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-none">HOTELHUB</p>
              <p className="text-white/40 text-xs">Espace PDG</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm hidden sm:block">
              <span className="text-white font-semibold">{user?.nom ?? "PDG"}</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-xl transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* KPI globaux */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Hôtels", value: mockHotels.length, suffix: "" },
            { label: "Réservations totales", value: totalReservations, suffix: "" },
            { label: "Taux d'occupation moy.", value: tauxMoyen, suffix: "%" },
            { label: "Recettes totales", value: (totalRecettes / 1000000).toFixed(1), suffix: "M FCFA" },
          ].map((k) => (
            <div key={k.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg text-left">
              <p className="text-white text-2xl font-bold">{k.value}<span className="text-white/60 text-sm font-normal ml-1">{k.suffix}</span></p>
              <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 w-fit flex-wrap">
          {([
            ["hotels", "Mes hôtels"],
            ["reservations", "Réservations"],
            ["avis", "Avis"],
            ["stats", "Statistiques"],
          ] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? "bg-[var(--blue)] text-white shadow" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Hôtels */}
        {tab === "hotels" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddHotel(!showAddHotel)}
                className="bg-[var(--blue)] hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow"
              >
                + Ajouter un hôtel
              </button>
            </div>

            {showAddHotel && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 shadow-lg text-left">
                <h3 className="text-white font-bold text-base mb-4">Nouvel hôtel</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Nom", "Localisation", "Nombre de chambres", "Email", "Téléphone"].map((f) => (
                    <div key={f} className="flex flex-col gap-1">
                      <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">{f}</label>
                      <input className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--blue)] transition-all" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">Étoiles</label>
                    <select className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--blue)] transition-all appearance-none">
                      {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-gray-900">{n} étoile{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="bg-[var(--blue)] hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                    Enregistrer
                  </button>
                  <button onClick={() => setShowAddHotel(false)} className="text-white/50 hover:text-white text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all">
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {mockHotels.map((h) => (
                <div key={h.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-base">{h.nom}</span>
                      <span className="text-yellow-400 text-sm">{"★".repeat(h.etoiles)}</span>
                    </div>
                    <p className="text-white/60 text-sm">📍 {h.localisation}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {h.services.map((s) => (
                        <span key={s} className="text-xs bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full border border-white/10">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-white/60 text-sm">{h.nombreChambres} chambres</p>
                    <p className="text-white text-sm font-semibold">{h.tauxOccupation}% occupé</p>
                    <div className="flex gap-2">
                      <button className="text-xs text-white/60 hover:text-white border border-white/20 px-3 py-1 rounded-lg transition-all">Modifier</button>
                      <button className="text-xs text-red-300 hover:text-red-200 border border-red-400/30 px-3 py-1 rounded-lg transition-all">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Réservations */}
        {tab === "reservations" && (
          <div className="flex flex-col gap-4">
            {mockReservations.map((r) => (
              <div key={r.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{r.chambre}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUT_STYLE[r.statut]}`}>
                      {STATUT_LABEL[r.statut]}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">📍 {r.hotel} — {r.localisation}</p>
                  <p className="text-white/50 text-xs mt-1">Du {r.jourDebut} au {r.jourFin}</p>
                </div>
                <span className="text-white font-bold text-lg">{r.montantTotal.toLocaleString("fr-FR")} <span className="text-white/50 text-sm font-normal">FCFA</span></span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Avis */}
        {tab === "avis" && (
          <div className="flex flex-col gap-4">
            {mockAvis.map((a) => (
              <div key={a.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg text-left">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-semibold">{a.hotel}</p>
                  <span className="text-white/40 text-xs">{a.dateDepot}</span>
                </div>
                <p className="text-white/80 text-sm">"{a.texte}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Stats */}
        {tab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mockHotels.map((h) => (
              <div key={h.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg text-left">
                <p className="text-white font-bold mb-1">{h.nom}</p>
                <p className="text-white/50 text-xs mb-4">📍 {h.localisation}</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Réservations</p>
                    <p className="text-white text-xl font-bold">{h.statReservations}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Recettes</p>
                    <p className="text-white text-xl font-bold">{(h.statRecettes / 1000000).toFixed(1)}<span className="text-white/50 text-sm font-normal ml-1">M FCFA</span></p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Taux d'occupation</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--blue)] rounded-full" style={{ width: `${h.tauxOccupation}%` }} />
                      </div>
                      <span className="text-white text-sm font-semibold">{h.tauxOccupation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
