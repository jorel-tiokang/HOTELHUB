/**
 * mock-db.ts
 * Single source of truth for all seeded mock data used by the service layer.
 * When switching to a real backend, this file is simply deleted.
 *
 * IMPORTANT: these interfaces deliberately use "backend-style" naming
 * (snake_case / different attribute names) to prove the Adapter layer works.
 */

// ── Backend-style user DTO (what the real API would return) ──────────────────

export type BackendRole = "CLIENT" | "PDG" | "DIRECTEUR";

export interface BackendUserDTO {
  user_id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  user_role: BackendRole;
  // optional fields
  location?: string;
  gender?: string;
  birth_date?: string;
  home_address?: string;
  assigned_hotel_id?: string;
  // auth
  hashed_password: string;
  access_token: string;
}

// ── Backend-style booking DTO ────────────────────────────────────────────────

export type BackendBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface BackendBookingDTO {
  booking_ref: string;
  hotel_identifier: string;
  hotel_name: string;
  hotel_city: string;
  hotel_cover_url: string;
  room_identifier: string;
  room_category: string;
  room_number: number;
  start_date: string;  // "YYYY-MM-DD"
  end_date: string;    // "YYYY-MM-DD"
  guest_count: number;
  total_cost_xaf: number;
  booking_status: BackendBookingStatus;
  created_at_date: string;
  client_user_id: string;
}

// ── Seeded users ─────────────────────────────────────────────────────────────

export const mockUsers: BackendUserDTO[] = [
  {
    user_id: "u-client-001",
    full_name: "Alice Martin",
    email_address: "client@hotelhub.com",
    phone_number: "+237 670 000 001",
    user_role: "CLIENT",
    location: "Douala, Cameroun",
    gender: "Femme",
    birth_date: "1995-04-12",
    home_address: "Akwa, Douala",
    hashed_password: "password123",
    access_token: "mock-token-client-abc",
  },
  {
    user_id: "u-director-001",
    full_name: "Jean-Paul Mbarga",
    email_address: "director@hotelhub.com",
    phone_number: "+237 670 000 002",
    user_role: "DIRECTEUR",
    assigned_hotel_id: "h1",
    hashed_password: "password123",
    access_token: "mock-token-director-xyz",
  },
  {
    user_id: "u-pdg-001",
    full_name: "Sophie Nkolo",
    email_address: "pdg@hotelhub.com",
    phone_number: "+237 670 000 003",
    user_role: "PDG",
    hashed_password: "password123",
    access_token: "mock-token-pdg-007",
  },
];

// ── Seeded bookings (mutable — updated in-memory when a user books a room) ──

export let mockBookings: BackendBookingDTO[] = [
  {
    booking_ref: "BK-001",
    hotel_identifier: "h5",
    hotel_name: "Hilton Hotel",
    hotel_city: "Yaoundé",
    hotel_cover_url:
      "https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=500&auto=format&fit=crop&q=60",
    room_identifier: "r7",
    room_category: "Suite Présidentielle",
    room_number: 501,
    start_date: "2026-07-10",
    end_date: "2026-07-14",
    guest_count: 2,
    total_cost_xaf: 740000,
    booking_status: "CONFIRMED",
    created_at_date: "2026-06-15",
    client_user_id: "u-client-001",
  },
  {
    booking_ref: "BK-002",
    hotel_identifier: "h3",
    hotel_name: "Maona Loa Lodge",
    hotel_city: "Kribi",
    hotel_cover_url:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&auto=format&fit=crop&q=80",
    room_identifier: "r4",
    room_category: "Double",
    room_number: 301,
    start_date: "2026-08-02",
    end_date: "2026-08-06",
    guest_count: 2,
    total_cost_xaf: 232000,
    booking_status: "PENDING",
    created_at_date: "2026-06-17",
    client_user_id: "u-client-001",
  },
  {
    booking_ref: "BK-003",
    hotel_identifier: "h1",
    hotel_name: "Hakuna Matata Resort",
    hotel_city: "Douala",
    hotel_cover_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80",
    room_identifier: "r1",
    room_category: "Double",
    room_number: 101,
    start_date: "2026-03-20",
    end_date: "2026-03-24",
    guest_count: 2,
    total_cost_xaf: 260000,
    booking_status: "COMPLETED",
    created_at_date: "2026-03-10",
    client_user_id: "u-client-001",
  },
  {
    booking_ref: "BK-004",
    hotel_identifier: "h7",
    hotel_name: "Mont Fébé",
    hotel_city: "Yaoundé",
    hotel_cover_url:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60",
    room_identifier: "r9",
    room_category: "Junior Suite",
    room_number: 701,
    start_date: "2026-02-14",
    end_date: "2026-02-17",
    guest_count: 1,
    total_cost_xaf: 360000,
    booking_status: "CANCELLED",
    created_at_date: "2026-02-01",
    client_user_id: "u-client-001",
  },
];

// ── Helper ───────────────────────────────────────────────────────────────────

/** Simulate a backend network round-trip */
export const fakeDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
