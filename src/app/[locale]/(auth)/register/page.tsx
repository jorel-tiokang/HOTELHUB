"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

const SEXES = ["Homme", "Femme", "Autre"];

const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1 text-left">
    <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] focus:bg-white/15 transition-all"
    />
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    telephone: "",
    localisation: "",
    sexe: "",
    dateNaissance: "",
    adresse: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await register(form);
    const state = useAuthStore.getState();
    if (!state.error && state.isAuthenticated) {
      router.push(state.getRedirectPath(locale));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat py-10 relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Added 'flex flex-col items-center' here so logo stacks perfectly above card */}
      <div className="relative z-10 w-full max-w-xl mx-4 flex flex-col items-center">

        {/* Logo is now inside the center wrapper right above the card */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src="/hotelhublogo.png"
            alt="HotelHub Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <span className="text-purple font-bold text-2xl tracking-wide">HOTELHUB</span>
        </div>

        {/* Register Card Box */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-white text-2xl font-bold mb-1">Inscription</h1>
          <p className="text-white/60 text-sm mb-6">Créez votre compte pour commencer.</p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-400/40 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Nom complet"
              name="nom"
              placeholder="Jean Dupont"
              value={form.nom}
              onChange={handleChange}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              value={form.email}
              onChange={handleChange}
            />
            <Field
              label="Mot de passe"
              name="motDePasse"
              type="password"
              placeholder="••••••••"
              value={form.motDePasse}
              onChange={handleChange}
            />
            <Field
              label="Téléphone"
              name="telephone"
              placeholder="+237 6XX XXX XXX"
              value={form.telephone}
              onChange={handleChange}
            />
            <Field
              label="Localisation"
              name="localisation"
              placeholder="Douala, Cameroun"
              value={form.localisation}
              onChange={handleChange}
            />
            <Field
              label="Adresse"
              name="adresse"
              placeholder="Rue, Quartier"
              value={form.adresse}
              onChange={handleChange}
            />
            <Field
              label="Date de naissance"
              name="dateNaissance"
              type="date"
              value={form.dateNaissance}
              onChange={handleChange}
            />

            {/* Sexe */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Sexe
              </label>
              <select
                name="sexe"
                value={form.sexe}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--blue)] transition-all appearance-none"
              >
                <option value="" className="bg-gray-900">
                  Choisir...
                </option>
                {SEXES.map((s) => (
                  <option key={s} value={s} className="bg-gray-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full bg-purple hover:bg-purple/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création du compte…
              </>
            ) : (
              "S'inscrire"
            )}
          </button>

          <p className="text-white/50 text-sm mt-6 text-center">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}