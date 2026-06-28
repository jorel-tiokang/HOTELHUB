/**
 * reservationStore.ts
 *
 * Global state for client bookings.
 * Calls bookingService → bookingAdapter — zero direct data logic here.
 */

import { create } from "zustand";
import * as bookingService from "@/src/services/bookingService";
import {
  mapBackendBookingToClient,
  mapManyBackendBookings,
} from "@/src/adapters/bookingAdapter";
import type { ClientReservation } from "@/mocks/clientBookings";
export type { ClientReservation };
import type { CreateBookingPayload } from "@/src/services/bookingService";

interface ReservationState {
  bookings: ClientReservation[];
  isLoading: boolean;
  error: string | null;

  /** Load all bookings for the logged-in user */
  fetchBookings: (userId: string) => Promise<void>;

  /** Load all bookings for a specific hotel (for directors) */
  fetchHotelBookings: (hotelId: string) => Promise<void>;

  /** Create a new booking (also marks the room as INDISPONIBLE in hotelsStore) */
  createBooking: (payload: CreateBookingPayload) => Promise<ClientReservation>;

  /** Cancel a booking by its reference id */
  cancelBooking: (bookingId: string) => Promise<void>;

  /** Pay for a booking (changes status to PAID) */
  payBooking: (bookingId: string) => Promise<void>;

  clearError: () => void;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  // ── Fetch ──────────────────────────────────────────────────────────────────
  fetchBookings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const rawBookings = await bookingService.getBookingsForUser(userId);
      const bookings = mapManyBackendBookings(rawBookings);
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchHotelBookings: async (hotelId) => {
    set({ isLoading: true, error: null });
    try {
      const rawBookings = await bookingService.getBookingsForHotel(hotelId);
      const bookings = mapManyBackendBookings(rawBookings);
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // ── Create ─────────────────────────────────────────────────────────────────
  createBooking: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const rawBooking = await bookingService.createBooking(payload);
      const booking = mapBackendBookingToClient(rawBooking);

      // Optimistically add to local list
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isLoading: false,
      }));

      return booking;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err; // Re-throw so calling components can show the error
    }
  },

  // ── Cancel ─────────────────────────────────────────────────────────────────
  cancelBooking: async (bookingId) => {
    set({ error: null });
    try {
      const rawBooking = await bookingService.cancelBooking(bookingId);
      const updated = mapBackendBookingToClient(rawBooking);

      // Replace the old booking in the list with the updated one
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === updated.id ? updated : b
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // ── Pay ────────────────────────────────────────────────────────────────────
  payBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const rawBooking = await bookingService.payBooking(bookingId);
      const updated = mapBackendBookingToClient(rawBooking);

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === updated.id ? updated : b
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
