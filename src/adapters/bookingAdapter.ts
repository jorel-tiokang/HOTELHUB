/**
 * bookingAdapter.ts
 *
 * Translates a backend BackendBookingDTO into the ClientReservation type
 * that BookingCard, ClientDashboard, and related components expect.
 *
 * Status mapping converts English backend statuses → French frontend statuses.
 */

import type { BackendBookingDTO, BackendBookingStatus } from "@/src/services/mock-db";
import type { ClientReservation, StatutReservationClient } from "@/mocks/clientBookings";

// Maps the English backend booking status to the French UI status
const STATUS_MAP: Record<BackendBookingStatus, StatutReservationClient> = {
  UNPAID: "IMPAYEE",
  PAID: "PAYEE",
  PENDING: "EN_ATTENTE",
  CONFIRMED: "CONFIRMEE",
  CANCELLED: "ANNULEE",
  COMPLETED: "TERMINEE",
};

export function mapBackendBookingToClient(
  dto: BackendBookingDTO
): ClientReservation {
  return {
    id: dto.booking_ref,
    hotelId: dto.hotel_identifier,
    hotelNom: dto.hotel_name,
    hotelVille: dto.hotel_city,
    hotelImage: dto.hotel_cover_url,
    chambreId: dto.room_identifier,
    chambreType: dto.room_category,
    chambreNumero: dto.room_number,
    jourDebut: dto.start_date,
    jourFin: dto.end_date,
    nombrePersonnes: dto.guest_count,
    montantTotal: dto.total_cost_xaf,
    statut: STATUS_MAP[dto.booking_status],
    createdAt: dto.created_at_date,
    clientName: dto.client_full_name,
    clientId: dto.client_user_id,
    expectedArrivalTime: dto.expected_arrival_time,
  };
}

export function mapManyBackendBookings(
  dtos: BackendBookingDTO[]
): ClientReservation[] {
  return dtos.map(mapBackendBookingToClient);
}
