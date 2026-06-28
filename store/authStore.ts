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

/** Account created by the PDG for a Director General */
export interface DirectorAccount {
  id: string;
  nom: string;
  email: string;
  motDePasse: string;      // stored in plain text (mock only)
  telephone?: string;
  telephone2?: string;
  sexe?: string;
  role: "DIRECTEUR";
  hotelId: string;         // hotel assigned by the PDG
  createdAt: string;
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

  /** In-memory list of Director accounts created by the PDG */
  directors: DirectorAccount[];

  login: (email: string, motDePasse: string) => Promise<void>;
  register: (data: RegisterClientData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  clearError: () => void;

  // Director CRUD (PDG only)
  addDirector: (data: Omit<DirectorAccount, "id" | "createdAt">) => DirectorAccount;
  removeDirector: (id: string) => void;
  updateDirector: (id: string, data: Partial<DirectorAccount>) => void;

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
      directors: [],

      // ── Login ──────────────────────────────────────────────────────────────
      login: async (email, motDePasse) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Check in-memory directors list first (created by PDG)
          const director = get().directors.find(
            (d) => d.email === email && d.motDePasse === motDePasse
          );
          if (director) {
            const directorUser: AuthUser = {
              id: director.id,
              nom: director.nom,
              email: director.email,
              telephone: director.telephone || "",
              role: "DIRECTEUR",
              sexe: director.sexe,
              hotelId: director.hotelId,
            };
            set({ user: directorUser, token: `local-${director.id}`, isAuthenticated: true, isLoading: false });
            return;
          }

          // 2. Fall back to the service layer (mock or real backend)
          const { user: dto, token } = await authService.login({ email, motDePasse });
          const user = mapBackendUserToClient(dto);
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

      // ── Profile update ─────────────────────────────────────────────────────
      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },

      clearError: () => set({ error: null }),

      // ── Director CRUD (PDG only) ───────────────────────────────────────────
      addDirector: (data) => {
        const newDirector: DirectorAccount = {
          ...data,
          id: `dir-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ directors: [...state.directors, newDirector] }));
        return newDirector;
      },

      removeDirector: (id) =>
        set((state) => ({ directors: state.directors.filter((d) => d.id !== id) })),

      updateDirector: (id, data) =>
        set((state) => ({
          directors: state.directors.map((d) => (d.id === id ? { ...d, ...data } : d)),
        })),

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
        directors: state.directors,
      }),
    }
  )
);

