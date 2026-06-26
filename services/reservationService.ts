import api from "./api";

export interface CreateReservationPayload {
  chambreId: string;
  dateArrivee: string;
  dateDepart: string;
}

export interface ReservationResponse {
  id: string;
  clientId: string;
  chambreId: string;
  dateArrivee: string;
  dateDepart: string;
  dureeNuits: number;
  montantTotal: number;
  statut: string;
  creeLe: string;
}

export const STATUS_MAP: Record<string, string> = {
  EN_ATTENTE: "EN_ATTENTE",
  CONFIRMEE: "CONFIRMEE",
  EN_COURS: "CONFIRMEE",
  TERMINEE: "TERMINEE",
  ANNULEE: "ANNULEE",
};

export async function createReservation(
  payload: CreateReservationPayload
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>(
    "/reservations",
    payload
  );
  return data;
}

export async function getReservationsByClient(
  clientId: string
): Promise<ReservationResponse[]> {
  const { data } = await api.get<ReservationResponse[]>(
    `/reservations/client/${clientId}`
  );
  return data;
}

export async function getReservationsByHotel(
  hotelId: string
): Promise<ReservationResponse[]> {
  const { data } = await api.get<ReservationResponse[]>(
    `/reservations/hotel/${hotelId}`
  );
  return data;
}

export async function confirmReservation(
  id: string
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>(
    `/reservations/${id}/confirmer`
  );
  return data;
}

export async function cancelReservation(
  id: string,
  motif?: string
): Promise<ReservationResponse> {
  const { data } = await api.post<ReservationResponse>(
    `/reservations/${id}/annuler`,
    null,
    { params: { motif } }
  );
  return data;
}
