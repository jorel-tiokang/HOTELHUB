"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { mockChambres, mockReservations, mockAvis, mockDirecteurHotel } from "@/mocks/dashboardMocks";

type Tab = "chambres" | "reservations" | "avis" | "stats";

const STATUT_CHAMBRE_STYLE: Record<string, string> = {
  DISPONIBLE: "bg-green-500/20 text-green-300 border-green-400/30",
  INDISPONIBLE: "bg-red-500/20 text-red-300 border-red-400/30",
};

const STATUT_RES_STYLE: Record<string, string> = {
  CONFIRMEE: "bg-green-500/20 text-green-300 border-green-400/30",
  EN_ATTENTE: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  ANNULEE: "bg-red-500/20 text-red-300 border-red-400/30",
};
const STATUT_RES_LABEL: Record<string, string> = {
  CONFIRMEE: "Confirmée",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulée",
};

export default function DashboardDirecteurPage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>("chambres");
  const [showAddChambre, setShowAddChambre] = useState(false);
  const [chambres, setChambres] = useState(mockChambres);
  const [reponses, setReponses] = useState<Record<string, string>>({});

  const toggleStatut = (id: string) => {
    setChambres((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, statut: c.statut === "DISPONIBLE" ? "INDISPONIBLE" : "DISPONIBLE" }
          : c
      )
    );
  };

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
              <p className="text-white/40 text-xs">Directeur — {mockDirecteurHotel.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm hidden sm:block">
              <span className="text-white font-semibold">{user?.nom ?? "Directeur"}</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-xl transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* KPI hôtel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Chambres", value: chambres.length },
            { label: "Disponibles", value: chambres.filter(c => c.statut === "DISPONIBLE").length },
            { label: "Réservations", value: mockReservations.length },
            { label: "Taux d'occupation", value: `${mockDirecteurHotel.tauxOccupation}%` },
          ].map((k) => (
            <div key={k.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg text-left">
              <p className="text-white text-2xl font-bold">{k.value}</p>
              <p className="text-white/50 text-xs uppercase tracking-wider mt-1">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 w-fit flex-wrap">
          {([
            ["chambres", "Chambres"],
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

        {/* Tab: Chambres */}
        {tab === "chambres" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddChambre(!showAddChambre)}
                className="bg-[var(--blue)] hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow"
              >
                + Ajouter une chambre
              </button>
            </div>

            {showAddChambre && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 shadow-lg text-left">
                <h3 className="text-white font-bold text-base mb-4">Nouvelle chambre</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Numéro", placeholder: "101" },
                    { label: "Type", placeholder: "Simple, Double, Suite..." },
                    { label: "Capacité (pers.)", placeholder: "2" },
                    { label: "Prix/nuit (FCFA)", placeholder: "85000" },
                    { label: "Description", placeholder: "Vue sur mer, climatisée..." },
                    { label: "Équipements", placeholder: "Wifi, Clim, TV..." },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">{f.label}</label>
                      <input
                        placeholder={f.placeholder}
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="bg-[var(--blue)] hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                    Enregistrer
                  </button>
                  <button onClick={() => setShowAddChambre(false)} className="text-white/50 hover:text-white text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all">
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {chambres.map((c) => (
                <div key={c.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">Chambre {c.numero} — {c.type}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUT_CHAMBRE_STYLE[c.statut]}`}>
                        {c.statut === "DISPONIBLE" ? "Disponible" : "Indisponible"}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{c.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {c.equipements.map((eq) => (
                        <span key={eq} className="text-xs bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full border border-white/10">{eq}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-fit">
                    <p className="text-white font-bold text-lg">{c.prixParNuit.toLocaleString("fr-FR")} <span className="text-white/50 text-sm font-normal">FCFA/nuit</span></p>
                    <p className="text-white/50 text-xs">{c.capacite} pers. max</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatut(c.id)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                          c.statut === "DISPONIBLE"
                            ? "text-red-300 border-red-400/30 hover:bg-red-500/10"
                            : "text-green-300 border-green-400/30 hover:bg-green-500/10"
                        }`}
                      >
                        {c.statut === "DISPONIBLE" ? "Marquer indisponible" : "Marquer disponible"}
                      </button>
                      <button className="text-xs text-white/60 hover:text-white border border-white/20 px-3 py-1 rounded-lg transition-all">Modifier</button>
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
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUT_RES_STYLE[r.statut]}`}>
                      {STATUT_RES_LABEL[r.statut]}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs">Du {r.jourDebut} au {r.jourFin}</p>
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
                <p className="text-white/80 text-sm mb-3">"{a.texte}"</p>
                {a.reponseDirecteur ? (
                  <div className="bg-[var(--blue)]/20 border border-[var(--blue)]/30 rounded-xl px-4 py-2">
                    <p className="text-white/50 text-xs mb-1 font-semibold uppercase tracking-wider">Votre réponse</p>
                    <p className="text-white/80 text-sm">{a.reponseDirecteur}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={2}
                      placeholder="Répondre à cet avis..."
                      value={reponses[a.id] ?? ""}
                      onChange={(e) => setReponses({ ...reponses, [a.id]: e.target.value })}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] transition-all resize-none w-full"
                    />
                    <button className="self-end bg-[var(--blue)] hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                      Envoyer la réponse
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Stats */}
        {tab === "stats" && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg text-left max-w-lg mx-auto">
            <p className="text-white font-bold text-lg mb-5">{mockDirecteurHotel.nom}</p>
            <div className="flex flex-col gap-5">
              {[
                { label: "Réservations ce mois", value: mockDirecteurHotel.statReservations },
                { label: "Recettes ce mois (FCFA)", value: mockDirecteurHotel.statRecettes.toLocaleString("fr-FR") },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-white text-2xl font-bold">{s.value}</p>
                </div>
              ))}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Taux d'occupation</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--blue)] rounded-full" style={{ width: `${mockDirecteurHotel.tauxOccupation}%` }} />
                  </div>
                  <span className="text-white font-bold text-lg">{mockDirecteurHotel.tauxOccupation}%</span>
                </div>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Disponibilité des chambres</p>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center bg-green-500/10 border border-green-400/20 rounded-xl p-4 flex-1">
                    <p className="text-green-300 text-2xl font-bold">{chambres.filter(c => c.statut === "DISPONIBLE").length}</p>
                    <p className="text-green-300/70 text-xs mt-1">Disponibles</p>
                  </div>
                  <div className="flex flex-col items-center bg-red-500/10 border border-red-400/20 rounded-xl p-4 flex-1">
                    <p className="text-red-300 text-2xl font-bold">{chambres.filter(c => c.statut === "INDISPONIBLE").length}</p>
                    <p className="text-red-300/70 text-xs mt-1">Indisponibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
