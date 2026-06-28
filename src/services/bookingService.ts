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
import {
  notifyDirectorNewBooking,
  notifyDirectorCancelledBooking,
  notifyClientBookingAccepted,
  notifyClientBookingCompleted,
} from "./notificationService";
import type { Hotel } from "@/services/hotel";
import { useHotelsStore } from "@/store/hotelsStore";

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
  clientFullName: string;
  expectedArrivalTime?: string;
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

  const hotel = useHotelsStore.getState().hotels.find((h) => h.id === payload.hotelId);
  if (!hotel) {
    throw new Error("L'hôtel sélectionné est introuvable.");
  }

  // Arrival time validation
  if (payload.expectedArrivalTime && hotel.receptionHours) {
    const { open, close } = hotel.receptionHours;
    if (payload.expectedArrivalTime < open || payload.expectedArrivalTime > close) {
      throw new Error(
        `L'heure d'arrivée (${payload.expectedArrivalTime}) est en dehors des heures d'ouverture de la réception (${open} - ${close}).`
      );
    }
  }

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
    booking_status: "UNPAID",
    created_at_date: new Date().toISOString().slice(0, 10),
    client_user_id: payload.clientUserId,
    client_full_name: payload.clientFullName,
    expected_arrival_time: payload.expectedArrivalTime,
  };

  mockBookings.push(newBooking);

  // Notify the hotel director about the new booking
  await notifyDirectorNewBooking(
    payload.hotelId,
    payload.clientFullName,
    newBooking.booking_ref
  );

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

  // Notify the hotel director about the cancellation
  await notifyDirectorCancelledBooking(
    booking.hotel_identifier,
    booking.client_full_name ?? "Un client",
    bookingRef
  );

  return mockBookings[idx];
}

// ── payBooking (client use) ───────────────────────────────────────────────────

export async function payBooking(
  bookingRef: string
): Promise<BackendBookingDTO> {
  await fakeDelay(800); // simulate payment gateway delay

  const idx = mockBookings.findIndex((b) => b.booking_ref === bookingRef);
  if (idx === -1) throw new Error("Réservation introuvable.");

  const booking = mockBookings[idx];
  if (booking.booking_status !== "UNPAID") {
    throw new Error("Cette réservation ne peut pas être payée dans son état actuel.");
  }

  mockBookings[idx] = { ...booking, booking_status: "PAID" };
  
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

  const prev = mockBookings[idx];
  mockBookings[idx] = { ...prev, booking_status: status };
  const updated = mockBookings[idx];

  // Notify the client depending on the new status
  if (status === "CONFIRMED") {
    await notifyClientBookingAccepted(
      updated.client_user_id,
      updated.hotel_name,
      bookingRef
    );
  } else if (status === "COMPLETED") {
    await notifyClientBookingCompleted(
      updated.client_user_id,
      updated.hotel_name,
      bookingRef
    );
  }

  return updated;
}
