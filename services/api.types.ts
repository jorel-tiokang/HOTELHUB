export type BackendRole = "CLIENT" | "PDG" | "DIRECTEUR";

export interface BackendUserDTO {
  user_id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  user_role: BackendRole;
  location?: string;
  gender?: string;
  birth_date?: string;
  home_address?: string;
  assigned_hotel_id?: string;
  hashed_password: string;
  access_token: string;
}

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
  start_date: string;
  end_date: string;
  guest_count: number;
  total_cost_xaf: number;
  booking_status: BackendBookingStatus;
  created_at_date: string;
  client_user_id: string;
}
