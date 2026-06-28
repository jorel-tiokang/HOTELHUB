import type { ClientReservation } from "@/mocks/clientBookings";

/**
 * Returns true if the room is free for the requested date range,
 * meaning no confirmed or pending reservation overlaps with [checkIn, checkOut).
 */
export function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  allBookings: ClientReservation[],
  hotelId?: string // Optional, needed to check if the entire hotel is privatized
): boolean {
  return !allBookings.some(
    (b) =>
      // The room is blocked if this specific room is booked OR the entire hotel is privatized
      (b.chambreId === roomId || (hotelId && b.hotelId === hotelId && b.chambreId === "PRIVATISATION")) &&
      b.statut !== "ANNULEE" &&
      b.statut !== "TERMINEE" &&
      new Date(b.jourDebut) < checkOut &&
      new Date(b.jourFin) > checkIn
  );
}

/**
 * Returns true if NO room in the hotel is booked (including no existing privatization)
 * for the requested date range.
 */
export function isHotelAvailableForPrivatization(
  hotelId: string,
  checkIn: Date,
  checkOut: Date,
  allBookings: ClientReservation[]
): boolean {
  return !allBookings.some(
    (b) =>
      b.hotelId === hotelId &&
      b.statut !== "ANNULEE" &&
      b.statut !== "TERMINEE" &&
      new Date(b.jourDebut) < checkOut &&
      new Date(b.jourFin) > checkIn
  );
}

/**
 * Returns true if at least one room in the hotel is available for the dates.
 */
export function hotelHasAvailableRooms(
  roomIds: string[],
  checkIn: Date,
  checkOut: Date,
  allBookings: ClientReservation[]
): boolean {
  return roomIds.some((id) => isRoomAvailable(id, checkIn, checkOut, allBookings));
}

/**
 * Calculate the number of nights between two dates.
 * Minimum 1.
 */
export function calcNights(checkIn: Date | string, checkOut: Date | string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / msPerDay)
  );
}
