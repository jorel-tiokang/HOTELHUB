/**
 * clientBookings.ts
 * Mock reservation data for the Client Dashboard.
 * Statuses mirror StatutReservation from types/utilisateur.ts:
 * "EN_ATTENTE" | "CONFIRMEE" | "ANNULEE"
 * plus extended statuses for display purposes:
 * "TERMINEE" (past, completed stay)
 */

export type StatutReservationClient =
  | "IMPAYEE"
  | "PAYEE"
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "ANNULEE"
  | "TERMINEE";

export interface ClientReservation {
  id: string;
  /** Links to Hotel.id in hotelsData.ts */
  hotelId: string;
  hotelNom: string;
  hotelVille: string;
  hotelImage: string;
  /** Links to Room.id inside that hotel */
  chambreId: string;
  chambreType: string;
  chambreNumero: number;
  jourDebut: string;   // ISO "YYYY-MM-DD"
  jourFin: string;     // ISO "YYYY-MM-DD"
  nombrePersonnes: number;
  montantTotal: number;
  statut: StatutReservationClient;
  createdAt: string;   // ISO "YYYY-MM-DD"
  clientName?: string;
  expectedArrivalTime?: string;
}

// ── Mock data — linked to hotelsData.ts IDs ─────────────────────────────────

export const clientBookings: ClientReservation[] = [
  {
    id: "CB001",
    hotelId: "h5",
    hotelNom: "Hilton Hotel",
    hotelVille: "Yaoundé",
    hotelImage:
      "https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=500&auto=format&fit=crop&q=60",
    chambreId: "r7",
    chambreType: "Suite Présidentielle",
    chambreNumero: 501,
    jourDebut: "2026-07-10",
    jourFin: "2026-07-14",
    nombrePersonnes: 2,
    montantTotal: 740000,
    statut: "CONFIRMEE",
    createdAt: "2026-06-15",
  },
  {
    id: "CB002",
    hotelId: "h3",
    hotelNom: "Maona Loa Lodge",
    hotelVille: "Kribi",
    hotelImage:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&auto=format&fit=crop&q=80",
    chambreId: "r4",
    chambreType: "Double",
    chambreNumero: 301,
    jourDebut: "2026-08-02",
    jourFin: "2026-08-06",
    nombrePersonnes: 2,
    montantTotal: 232000,
    statut: "EN_ATTENTE",
    createdAt: "2026-06-17",
  },
  {
    id: "CB003",
    hotelId: "h1",
    hotelNom: "Hakuna Matata Resort",
    hotelVille: "Douala",
    hotelImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80",
    chambreId: "r1",
    chambreType: "Double",
    chambreNumero: 101,
    jourDebut: "2026-03-20",
    jourFin: "2026-03-24",
    nombrePersonnes: 2,
    montantTotal: 260000,
    statut: "TERMINEE",
    createdAt: "2026-03-10",
  },
  {
    id: "CB004",
    hotelId: "h7",
    hotelNom: "Mont Fébé",
    hotelVille: "Yaoundé",
    hotelImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60",
    chambreId: "r9",
    chambreType: "Junior Suite",
    chambreNumero: 701,
    jourDebut: "2026-02-14",
    jourFin: "2026-02-17",
    nombrePersonnes: 1,
    montantTotal: 360000,
    statut: "ANNULEE",
    createdAt: "2026-02-01",
  },
];

// ── Helper functions ─────────────────────────────────────────────────────────

const today = new Date();
today.setHours(0, 0, 0, 0);

/** Bookings that haven't finished yet (checkOut is today or future) */
export function getUpcomingBookings(): ClientReservation[] {
  return clientBookings.filter((b) => {
    if (b.statut === "ANNULEE" || b.statut === "TERMINEE" || b.statut === "IMPAYEE") return false;
    return new Date(b.jourFin) >= today;
  });
}

/** Bookings that are fully in the past or marked TERMINEE / ANNULEE */
export function getPastBookings(): ClientReservation[] {
  return clientBookings.filter((b) => {
    if (b.statut === "TERMINEE" || b.statut === "ANNULEE") return true;
    return new Date(b.jourFin) < today;
  });
}

/** Get a single booking by its id */
export function getBookingById(id: string): ClientReservation | undefined {
  return clientBookings.find((b) => b.id === id);
}

/** Days until the next upcoming booking (or null if none) */
export function daysUntilNextBooking(): number | null {
  const upcoming = getUpcomingBookings().sort(
    (a, b) => new Date(a.jourDebut).getTime() - new Date(b.jourDebut).getTime(),
  );
  if (upcoming.length === 0) return null;
  const diff =
    new Date(upcoming[0].jourDebut).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Total nights across all non-cancelled bookings */
export function totalNightsBooked(): number {
  return clientBookings
    .filter((b) => b.statut !== "ANNULEE")
    .reduce((acc, b) => {
      const nights =
        (new Date(b.jourFin).getTime() - new Date(b.jourDebut).getTime()) /
        (1000 * 60 * 60 * 24);
      return acc + nights;
    }, 0);
}
