"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, getRedirectPath } = useAuthStore();
  const [form, setForm] = useState({ email: "", motDePasse: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await login(form.email, form.motDePasse);
    const path = getRedirectPath();
    if (path !== "/") router.push(path);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--blue)] flex items-center justify-center text-white font-bold text-lg">H</div>
          <span className="text-white font-bold text-2xl tracking-wide">HOTELHUB</span>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-white text-2xl font-bold mb-1">Connexion</h1>
          <p className="text-white/60 text-sm mb-6">Bienvenue, connectez-vous à votre espace.</p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-400/40 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] focus:bg-white/15 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">Mot de passe</label>
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--blue)] focus:bg-white/15 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-2 bg-[var(--blue)] hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide shadow-lg"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </div>

          <p className="text-white/50 text-sm mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-white font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}