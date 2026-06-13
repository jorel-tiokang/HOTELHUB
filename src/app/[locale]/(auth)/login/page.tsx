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

  // --- REPLACE YOUR OLD handleSubmit WITH THIS ---
  const handleSubmit = async () => {
    if (!form.email || !form.motDePasse) {
      useAuthStore.setState({ error: "Veuillez remplir tous les champs." });
      return;
    }

    try {
      await login(form.email, form.motDePasse);
      
      const currentError = useAuthStore.getState().error;
      if (currentError) {
        handleFriendlyError(currentError);
        return;
      }

      const path = getRedirectPath();
      if (path !== "/") router.push(path);
      
    } catch (err: any) {
      handleFriendlyError(err?.message || "");
    }
  };

  // --- PASTE THIS NEW HELPER FUNCTION HERE ---
  const handleFriendlyError = (rawError: string) => {
    const lowerError = rawError.toLowerCase();
    let friendlyMessage = "Identifiants incorrects. Veuillez réessayer.";

    if (lowerError.includes("json") || lowerError.includes("unexpected token")) {
      friendlyMessage = "Le serveur rencontre un problème. Veuillez réessayer plus tard.";
    } else if (lowerError.includes("network") || lowerError.includes("fetch")) {
      friendlyMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
    } else if (lowerError.includes("401") || lowerError.includes("unauthorized") || lowerError.includes("invalid")) {
      friendlyMessage = "Email ou mot de passe incorrect.";
    } else if (rawError) {
      friendlyMessage = rawError;
    }

    useAuthStore.setState({ error: friendlyMessage });
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
          <img
          src="/hotelhublogo.png"
          alt="HotelHub Logo"
          className="w-10 h-10 object-contain rounded-lg"
        />
          <span className="text-purple font-bold text-2xl tracking-wide">HOTELHUB</span>
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
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--purple)] focus:bg-white/15 transition-all"
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
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[var(--purple)] focus:bg-white/15 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-2 bg-purple hover:bg-(--purple)/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide shadow-lg"
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