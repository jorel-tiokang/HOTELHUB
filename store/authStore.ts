/**
 * authStore.ts
 *
 * Global authentication state managed by Zustand with localStorage persistence.
 * All data operations go through authService → authAdapter.
 * This store contains ZERO knowledge of how the data is fetched or structured
 * on the server side — it only holds clean frontend state.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "@/src/services/authService";
import { mapBackendUserToClient } from "@/src/adapters/authAdapter";

export type Role = "CLIENT" | "PDG" | "DIRECTEUR";

export interface AuthUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  localisation?: string;
  sexe?: string;
  dateNaissance?: string;
  adresse?: string;
  hotelId?: string;
}

export interface RegisterClientData {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  localisation: string;
  sexe: string;
  dateNaissance: string;
  adresse: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, motDePasse: string) => Promise<void>;
  register: (data: RegisterClientData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  clearError: () => void;

  // Role guards
  isClient: () => boolean;
  isPDG: () => boolean;
  isDirecteur: () => boolean;
  getRedirectPath: (locale?: string) => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Login ──────────────────────────────────────────────────────────────
      login: async (email, motDePasse) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Call the Service Layer (mock or real — doesn't matter)
          const { user: dto, token } = await authService.login({
            email,
            motDePasse,
          });

          // 2. Run through the Adapter to get a clean frontend AuthUser
          const user = mapBackendUserToClient(dto);

          // 3. Update state
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message ?? "Erreur de connexion.", isLoading: false });
        }
      },

      // ── Register ───────────────────────────────────────────────────────────
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user: dto, token } = await authService.register(data);
          const user = mapBackendUserToClient(dto);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message ?? "Erreur lors de l'inscription.", isLoading: false });
        }
      },

      // ── Logout ─────────────────────────────────────────────────────────────
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, error: null }),

      // ── Profile update (client-side only — no service call needed) ─────────
      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },

      clearError: () => set({ error: null }),

      // ── Role guards ────────────────────────────────────────────────────────
      isClient: () => get().user?.role === "CLIENT",
      isPDG: () => get().user?.role === "PDG",
      isDirecteur: () => get().user?.role === "DIRECTEUR",

      getRedirectPath: (locale = "fr") => {
        const role = get().user?.role;
        switch (role) {
          case "CLIENT":
            return `/${locale}/dashboard/client`;
          case "PDG":
            return `/${locale}/dashboard/pdg`;
          case "DIRECTEUR":
            return `/${locale}/dashboard/directeur`;
          default:
            return `/${locale}`;
        }
      },
    }),
    {
      name: "hotelhub-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
