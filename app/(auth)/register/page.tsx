"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

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
    router.push("app/dashboard/client/page.tsx");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat py-10">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-xl mx-4">
        {/* ... Logo et titres ... */}

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* ... Gestion des erreurs ... */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ✅ 2. ON PASSE MAINTENANT LA VALUE ET LE ONCHANGE EXPLICITEMENT */}
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

            {/* Sexe (Select reste tel quel) */}
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

className="mt-6 w-full bg-[var(--blue)] hover:bg-(--blue)/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide shadow-lg"

>

{isLoading ? "Création du compte..." : "S'inscrire"}

</button>


<p className="text-white/50 text-sm mt-6">

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
