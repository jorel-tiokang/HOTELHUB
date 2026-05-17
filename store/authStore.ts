import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "CLIENT" | "PDG" | "DIRECTEUR";

export interface AuthUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  // Client uniquement
  localisation?: string;
  sexe?: string;
  dateNaissance?: string;
  adresse?: string;
  // Directeur uniquement
  hotelId?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, motDePasse: string) => Promise<void>;
  register: (data: RegisterClientData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  clearError: () => void;

  // Guards
  isClient: () => boolean;
  isPDG: () => boolean;
  isDirecteur: () => boolean;
  getRedirectPath: () => string;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, motDePasse) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, motDePasse }),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Identifiants incorrects");
          }

          const { user, token } = await response.json();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, role: "CLIENT" }),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Erreur lors de l'inscription");
          }

          const { user, token } = await response.json();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },

      clearError: () => set({ error: null }),

      // Guards
      isClient: () => get().user?.role === "CLIENT",
      isPDG: () => get().user?.role === "PDG",
      isDirecteur: () => get().user?.role === "DIRECTEUR",

      getRedirectPath: () => {
        const role = get().user?.role;
        switch (role) {
          case "CLIENT":
            return "/dashboard";
          case "PDG":
            return "/dashboard/pdg";
          case "DIRECTEUR":
            return "/dashboard/directeur";
          default:
            return "/";
        }
      },
    }),
    {
      name: "hotelhub-auth",
      // Ne persister que le strict nécessaire
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
