/**
 * notificationService.ts
 *
 * Manages in-memory notifications for both directors and clients.
 * When switching to a real backend, replace body of each function with
 * the appropriate fetch() call.
 */

import {
  mockNotifications,
  mockUsers,
  fakeDelay,
  type BackendNotificationDTO,
} from "./mock-db";
import type { NotificationType } from "@/services/api.types";

// ── Internal helper ───────────────────────────────────────────────────────────

function createNotification(
  recipientUserId: string,
  type: NotificationType,
  title: string,
  message: string,
  bookingRef?: string
): BackendNotificationDTO {
  const notif: BackendNotificationDTO = {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    recipient_user_id: recipientUserId,
    type,
    title,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
    booking_ref: bookingRef,
  };
  mockNotifications.push(notif);
  return notif;
}

// ── Notify the director of a hotel ───────────────────────────────────────────

/**
 * Resolves the director's user_id from their assigned_hotel_id.
 * Returns null if no director is found for that hotel.
 */
function findDirectorForHotel(hotelId: string): string | null {
  const director = mockUsers.find(
    (u) => u.user_role === "DIRECTEUR" && u.assigned_hotel_id === hotelId
  );
  return director?.user_id ?? null;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function notifyDirectorNewBooking(
  hotelId: string,
  clientName: string,
  bookingRef: string
): Promise<void> {
  const directorId = findDirectorForHotel(hotelId);
  if (!directorId) return;
  createNotification(
    directorId,
    "BOOKING_NEW",
    "Nouvelle réservation",
    `${clientName} vient de réserver une chambre.`,
    bookingRef
  );
}

export async function notifyDirectorCancelledBooking(
  hotelId: string,
  clientName: string,
  bookingRef: string
): Promise<void> {
  const directorId = findDirectorForHotel(hotelId);
  if (!directorId) return;
  createNotification(
    directorId,
    "BOOKING_CANCELLED",
    "Réservation annulée",
    `${clientName} a annulé sa réservation.`,
    bookingRef
  );
}

export async function notifyDirectorNewReview(
  hotelId: string,
  clientName: string,
  rating: number
): Promise<void> {
  const directorId = findDirectorForHotel(hotelId);
  if (!directorId) return;
  createNotification(
    directorId,
    "REVIEW_NEW",
    "Nouvel avis client",
    `${clientName} a laissé un avis ${rating}★ sur votre hôtel.`
  );
}

export async function notifyClientBookingAccepted(
  clientUserId: string,
  hotelName: string,
  bookingRef: string
): Promise<void> {
  createNotification(
    clientUserId,
    "BOOKING_ACCEPTED",
    "Réservation confirmée !",
    `Votre réservation à ${hotelName} a été confirmée par le directeur.`,
    bookingRef
  );
}

export async function notifyClientBookingCompleted(
  clientUserId: string,
  hotelName: string,
  bookingRef: string
): Promise<void> {
  createNotification(
    clientUserId,
    "BOOKING_COMPLETED",
    "Séjour terminé",
    `Votre séjour à ${hotelName} est terminé. Laissez un avis !`,
    bookingRef
  );
}

export async function notifyClientReviewReply(
  clientUserId: string,
  hotelName: string,
  bookingRef: string
): Promise<void> {
  createNotification(
    clientUserId,
    "REVIEW_REPLY",
    "Nouveau message du directeur",
    `Le directeur de ${hotelName} a répondu à votre avis.`,
    bookingRef
  );
}

// ── Read / Mark as read ───────────────────────────────────────────────────────

export async function getUnreadNotifications(
  userId: string
): Promise<BackendNotificationDTO[]> {
  await fakeDelay(100);
  return mockNotifications.filter(
    (n) => n.recipient_user_id === userId && !n.is_read
  );
}

export async function getAllNotifications(
  userId: string
): Promise<BackendNotificationDTO[]> {
  await fakeDelay(100);
  return mockNotifications
    .filter((n) => n.recipient_user_id === userId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function markNotificationRead(notifId: string): Promise<void> {
  const notif = mockNotifications.find((n) => n.id === notifId);
  if (notif) notif.is_read = true;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  mockNotifications
    .filter((n) => n.recipient_user_id === userId)
    .forEach((n) => { n.is_read = true; });
}
