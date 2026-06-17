import { create } from "zustand";
import type { ClientReservation, StatutReservationClient } from "@/mocks/clientBookings";

// ── Tab types ────────────────────────────────────────────────────────────────
export type DashboardTab = "reservations" | "avis" | "profil";

// ── Sort options for the bookings list ──────────────────────────────────────
export type SortBy = "date-asc" | "date-desc" | "price-asc" | "price-desc";

// ── Filter by status (TOUS = show all) ──────────────────────────────────────
export type FilterStatut = StatutReservationClient | "TOUS";

// ── Store interface ──────────────────────────────────────────────────────────
interface ClientDashboardState {
  // UI state
  activeTab: DashboardTab;
  showPastBookings: boolean;
  sortBy: SortBy;
  filterStatut: FilterStatut;

  // Modal state
  selectedBooking: ClientReservation | null;
  isDetailOpen: boolean;

  // Actions
  setActiveTab: (tab: DashboardTab) => void;
  togglePastBookings: () => void;
  setSortBy: (sort: SortBy) => void;
  setFilterStatut: (statut: FilterStatut) => void;
  openDetail: (booking: ClientReservation) => void;
  closeDetail: () => void;
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useClientDashboardStore = create<ClientDashboardState>((set) => ({
  // Defaults
  activeTab: "reservations",
  showPastBookings: false,
  sortBy: "date-asc",
  filterStatut: "TOUS",
  selectedBooking: null,
  isDetailOpen: false,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  togglePastBookings: () =>
    set((state) => ({ showPastBookings: !state.showPastBookings })),

  setSortBy: (sort) => set({ sortBy: sort }),

  setFilterStatut: (statut) => set({ filterStatut: statut }),

  openDetail: (booking) => set({ selectedBooking: booking, isDetailOpen: true }),

  closeDetail: () => set({ selectedBooking: null, isDetailOpen: false }),
}));
