/**
 * reviewService.ts
 *
 * Manages client-submitted reviews for hotels.
 * To switch to a real backend, replace each function body with fetch().
 */

import {
  mockReviews,
  mockBookings,
  fakeDelay,
  type BackendReviewDTO,
} from "./mock-db";
import { notifyDirectorNewReview, notifyClientReviewReply } from "./notificationService";

export interface SubmitReviewPayload {
  bookingRef: string;
  hotelId: string;
  clientUserId: string;
  clientFullName: string;
  rating: number;
  comment: string;
}

// ── submitReview ──────────────────────────────────────────────────────────────

export async function submitReview(
  payload: SubmitReviewPayload
): Promise<BackendReviewDTO> {
  await fakeDelay(400);

  // Only completed bookings can be reviewed
  const booking = mockBookings.find(
    (b) => b.booking_ref === payload.bookingRef
  );
  if (!booking) throw new Error("Réservation introuvable.");
  if (booking.booking_status !== "COMPLETED") {
    throw new Error(
      "Vous ne pouvez laisser un avis que pour un séjour terminé."
    );
  }

  // Prevent double reviews on the same booking
  const existing = mockReviews.find(
    (r) => r.booking_ref === payload.bookingRef
  );
  if (existing) {
    throw new Error("Vous avez déjà laissé un avis pour ce séjour.");
  }

  const review: BackendReviewDTO = {
    id: `REV-${Date.now()}`,
    booking_ref: payload.bookingRef,
    hotel_id: payload.hotelId,
    client_user_id: payload.clientUserId,
    client_full_name: payload.clientFullName,
    rating: payload.rating,
    comment: payload.comment,
    created_at: new Date().toISOString().slice(0, 10),
  };

  mockReviews.push(review);

  // Notify the hotel director about the new review
  await notifyDirectorNewReview(
    payload.hotelId,
    payload.clientFullName,
    payload.rating
  );

  return review;
}

// ── getReviewsForHotel ────────────────────────────────────────────────────────

export async function getReviewsForHotel(
  hotelId: string
): Promise<BackendReviewDTO[]> {
  await fakeDelay(300);
  return mockReviews
    .filter((r) => r.hotel_id === hotelId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

// ── getReviewsForClient ───────────────────────────────────────────────────────

export async function getReviewsForClient(
  clientUserId: string
): Promise<BackendReviewDTO[]> {
  await fakeDelay(300);
  return mockReviews
    .filter((r) => r.client_user_id === clientUserId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

// ── hasReviewedBooking ────────────────────────────────────────────────────────

export function hasReviewedBooking(bookingRef: string): boolean {
  return mockReviews.some((r) => r.booking_ref === bookingRef);
}

// ── replyToReview ─────────────────────────────────────────────────────────────

export async function replyToReview(
  reviewId: string,
  replyText: string,
  hotelName: string
): Promise<BackendReviewDTO> {
  await fakeDelay(400);

  const idx = mockReviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) throw new Error("Avis introuvable.");

  const prev = mockReviews[idx];
  mockReviews[idx] = {
    ...prev,
    director_reply: replyText,
    director_reply_at: new Date().toISOString().slice(0, 10),
  };
  const updated = mockReviews[idx];

  // Notify client
  await notifyClientReviewReply(
    updated.client_user_id,
    hotelName,
    updated.booking_ref
  );

  return updated;
}
