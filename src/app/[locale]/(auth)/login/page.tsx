"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const { login, isLoading, error, clearError, getRedirectPath } = useAuthStore();
  const [form, setForm] = useState({ email: "", motDePasse: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.motDePasse) {
      useAuthStore.setState({ error: "Veuillez remplir tous les champs." });
      return;
    }

    await login(form.email, form.motDePasse);

    // Only redirect if login succeeded (no error set in store)
    const state = useAuthStore.getState();
    if (!state.error && state.isAuthenticated) {
      router.push(state.getRedirectPath(locale));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="h-screen overflow-hidden w-full flex items-center justify-center bg-[url('/landscape.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <img
            src="/hotelhublogo.png"
            alt="HotelHub Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <span className="text-purple font-bold text-2xl tracking-wide">
            HOTELHUB
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-white text-2xl font-bold mb-1">Connexion</h1>
          <p className="text-white/60 text-sm mb-6">
            Bienvenue, connectez-vous à votre espace.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-400/40 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="client@hotelhub.com"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple focus:bg-white/15 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Mot de passe
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="motDePasse"
                  value={form.motDePasse}
                  onChange={handleChange}
                  placeholder="••••••••"
                  // J'ai ajouté "pr-12" pour éviter que le texte long ne passe sous l'icône
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-12 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple focus:bg-white/15 transition-all"
                />

                <button
                  type="button" // CRUCIAL : empêche le bouton de soumettre le formulaire Enter/Click
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white focus:outline-none transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-2 bg-purple hover:bg-purple/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

          {/* Hint for testers */}
          <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 text-xs space-y-1">
            <p>🧪 <span className="font-semibold text-white/60">Client :</span> client@hotelhub.com</p>
            <p>🧪 <span className="font-semibold text-white/60">Directeur :</span> director@hotelhub.com</p>
            <p>🔑 Mot de passe : <span className="text-white/60">password123</span></p>
          </div>

          <p className="text-white/50 text-sm mt-5 text-center">
            Pas encore de compte?{" "}
            <Link
              href={`/${locale}/register`}
              className="text-white font-semibold hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}