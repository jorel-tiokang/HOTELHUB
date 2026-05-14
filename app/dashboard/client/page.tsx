"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { mockReservations, mockAvis } from "@/mocks/dashboardMocks";
import Footer from "@/components/footer";

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

type Tab = "reservations" | "avis" | "profil";

export default function DashboardClientPage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>("reservations");
  const [filterStatut, setFilterStatut] = useState("TOUS");

  const reservationsFiltrees = mockReservations.filter(
    (r) => filterStatut === "TOUS" || r.statut === filterStatut,
  );

  return (
    <div className="min-h-screen flex flex-col w-full bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex-1 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--blue)] flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <span className="text-white font-bold text-xl tracking-wide">
              HOTELHUB
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm hidden sm:block">
              Bonjour,{" "}
              <span className="text-white font-semibold">
                {user?.nom ?? "Client"}
              </span>
            </span>
            <Link href="/login">
              <button
                onClick={logout}
                className="text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-xl transition-all"
              >
                Déconnexion
              </button>
            </Link>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Réservations", value: mockReservations.length },
            {
              label: "Confirmées",
              value: mockReservations.filter((r) => r.statut === "CONFIRMEE")
                .length,
            },
            { label: "Avis déposés", value: mockAvis.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg"
            >
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 w-fit">
          {(["reservations", "avis", "profil"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                tab === t
                  ? "bg-blue text-white shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t === "reservations"
                ? "Réservations"
                : t === "avis"
                  ? "Mes avis"
                  : "Profil"}
            </button>
          ))}
        </div>

        {/* Tab: Réservations */}
        {tab === "reservations" && (
          <div>
            {/* Filtre statut */}
            <div className="flex gap-2 mb-5 flex-wrap justify-center">
              {["TOUS", "CONFIRMEE", "EN_ATTENTE", "ANNULEE"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatut(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filterStatut === s
                      ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                      : "border-white/20 text-white/60 hover:text-white"
                  }`}
                >
                  {s === "TOUS" ? "Tous" : STATUT_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {reservationsFiltrees.map((r) => (
                <div
                  key={r.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-base">
                        {r.chambre}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${STATUT_STYLE[r.statut]}`}
                      >
                        {STATUT_LABEL[r.statut]}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">
                      📍 {r.hotel} — {r.localisation}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Du {r.jourDebut} au {r.jourFin}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-white font-bold text-lg">
                      {r.montantTotal.toLocaleString("fr-FR")}{" "}
                      <span className="text-white/50 text-sm font-normal">
                        FCFA
                      </span>
                    </span>
                    {r.statut === "CONFIRMEE" && (
                      <button className="text-xs text-red-300 hover:text-red-200 border border-red-400/30 hover:border-red-300 px-3 py-1 rounded-lg transition-all">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {reservationsFiltrees.length === 0 && (
                <p className="text-white/40 text-sm py-10">
                  Aucune réservation trouvée.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab: Avis */}
        {tab === "avis" && (
          <div className="flex flex-col gap-4">
            {mockAvis.map((a) => (
              <div
                key={a.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-semibold">{a.hotel}</p>
                  <span className="text-white/40 text-xs">{a.dateDepot}</span>
                </div>
                <p className="text-white/80 text-sm mb-3">"{a.texte}"</p>
                {a.reponseDirecteur && (
                  <div className="bg-[var(--blue)]/20 border border-[var(--blue)]/30 rounded-xl px-4 py-2">
                    <p className="text-white/50 text-xs mb-1 font-semibold uppercase tracking-wider">
                      Réponse du directeur
                    </p>
                    <p className="text-white/80 text-sm">
                      {a.reponseDirecteur}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Profil */}
        {tab === "profil" && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg text-left max-w-lg mx-auto">
            <h2 className="text-white font-bold text-lg mb-5">
              Modifier mon profil
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Téléphone",
                  name: "telephone",
                  value: user?.telephone ?? "",
                },
                { label: "Adresse", name: "adresse", value: "" },
                { label: "Email", name: "email", value: user?.email ?? "" },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1">
                  <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                    {f.label}
                  </label>
                  <input
                    defaultValue={f.value}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--blue)] transition-all"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] transition-all"
                />
              </div>
              <button className="mt-2 bg-[var(--blue)] hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
