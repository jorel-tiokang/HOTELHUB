import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-200/50 shadow-sm bg-(--blue)/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <img
          src="/hotelhublogo.png"
          alt="HotelHub Logo"
          className="w-10 h-10 object-contain rounded-lg"
        />
        <h1 className="text-(--blue) font-black text-3xl tracking-tighter leading-none">
          HOTELHUB
        </h1>
      </div>

      {/* SECTION DROITE : DROPDOWNS & BOUTONS */}
      <div className="flex items-center gap-4">
        {/* Sélecteur de Langue */}
        <div className="relative group">
          {/* Le bouton principal */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer text-[var(--blue)] font-medium hover:bg-gray-50 transition-all">
            <span>Français</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* La liste d'options qui apparaît au survol ou au clic */}
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
            <div className="px-4 py-2 hover:bg-[var(--blue)]/10 cursor-pointer text-sm text-[var(--blue)]">
              Anglais
            </div>
            <div className="px-4 py-2 hover:bg-[var(--blue)]/10 cursor-pointer text-sm text-[var(--blue)]">
              Allemand
            </div>
          </div>
        </div>

        {/* Sélecteur de Devise */}
        <select className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer text-[var(--blue)] font-medium">
          <option>XAF (FCFA)</option> <option>USD ($)</option>
          <option>EUR (€)</option>
        </select>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3 ml-2">
          <Link href="/login">
            <button className="text-[var(--blue)] active:scale-95 font-bold px-4 py-2 hover:bg-white/50 rounded-xl transition-all">
              Connexion
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-[var(--blue)] text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all">
              Inscription
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
