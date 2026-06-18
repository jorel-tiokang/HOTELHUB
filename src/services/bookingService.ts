/**
 * bookingService.ts — Mock Booking Service
 *
 * Mimics a real REST booking API.
 * All mutations are applied to the in-memory mockBookings array so changes
 * persist for the lifetime of the browser session.
 * To switch to a real backend, only change the code inside these functions.
 */

import {
  mockBookings,
  fakeDelay,
  type BackendBookingDTO,
  type BackendBookingStatus,
} from "./mock-db";
import type { Hotel } from "@/services/hotel";

export interface CreateBookingPayload {
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelCoverUrl: string;
  roomId: string;
  roomCategory: string;
  roomNumber: number;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalCostXaf: number;
  clientUserId: string;
}

// ── getBookingsForUser ────────────────────────────────────────────────────────

export async function getBookingsForUser(
  userId: string
): Promise<BackendBookingDTO[]> {
  await fakeDelay(500);
  return mockBookings.filter((b) => b.client_user_id === userId);
}

// ── getBookingsForHotel ───────────────────────────────────────────────────────

export async function getBookingsForHotel(
  hotelId: string
): Promise<BackendBookingDTO[]> {
  await fakeDelay(500);
  return mockBookings.filter((b) => b.hotel_identifier === hotelId);
}

// ── createBooking ─────────────────────────────────────────────────────────────

export async function createBooking(
  payload: CreateBookingPayload
): Promise<BackendBookingDTO> {
  await fakeDelay(700);

  // Check that the room isn't already booked for overlapping dates
  const conflict = mockBookings.find(
    (b) =>
      b.room_identifier === payload.roomId &&
      b.booking_status !== "CANCELLED" &&
      b.booking_status !== "COMPLETED" &&
      payload.startDate < b.end_date &&
      payload.endDate > b.start_date
  );

  if (conflict) {
    throw new Error(
      "Cette chambre est déjà réservée pour les dates sélectionnées."
    );
  }

  const newBooking: BackendBookingDTO = {
    booking_ref: `BK-${Date.now()}`,
    hotel_identifier: payload.hotelId,
    hotel_name: payload.hotelName,
    hotel_city: payload.hotelCity,
    hotel_cover_url: payload.hotelCoverUrl,
    room_identifier: payload.roomId,
    room_category: payload.roomCategory,
    room_number: payload.roomNumber,
    start_date: payload.startDate,
    end_date: payload.endDate,
    guest_count: payload.guestCount,
    total_cost_xaf: payload.totalCostXaf,
    booking_status: "CONFIRMED",
    created_at_date: new Date().toISOString().slice(0, 10),
    client_user_id: payload.clientUserId,
  };

  mockBookings.push(newBooking);
  return newBooking;
}

// ── cancelBooking ─────────────────────────────────────────────────────────────

export async function cancelBooking(
  bookingRef: string
): Promise<BackendBookingDTO> {
  await fakeDelay(400);

  const idx = mockBookings.findIndex((b) => b.booking_ref === bookingRef);
  if (idx === -1) throw new Error("Réservation introuvable.");

  const booking = mockBookings[idx];
  if (booking.booking_status === "COMPLETED") {
    throw new Error("Impossible d'annuler un séjour déjà terminé.");
  }

  mockBookings[idx] = { ...booking, booking_status: "CANCELLED" };
  return mockBookings[idx];
}

// ── updateBookingStatus (director use) ───────────────────────────────────────

export async function updateBookingStatus(
  bookingRef: string,
  status: BackendBookingStatus
): Promise<BackendBookingDTO> {
  await fakeDelay(400);

  const idx = mockBookings.findIndex((b) => b.booking_ref === bookingRef);
  if (idx === -1) throw new Error("Réservation introuvable.");

  mockBookings[idx] = { ...mockBookings[idx], booking_status: status };
  return mockBookings[idx];
}
