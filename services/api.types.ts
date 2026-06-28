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
  | "UNPAID"     // created but not yet paid — director cannot accept
  | "PAID"       // payment confirmed — director can now accept
  | "PENDING"    // legacy / confirmed by director (kept for backwards compat)
  | "CONFIRMED"  // accepted by director
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
  client_full_name?: string;
  expected_arrival_time?: string;
}

export type NotificationType =
  | "BOOKING_NEW"
  | "BOOKING_ACCEPTED"
  | "BOOKING_CANCELLED"
  | "BOOKING_COMPLETED"
  | "REVIEW_NEW"
  | "REVIEW_REPLY";

export interface BackendNotificationDTO {
  id: string;
  recipient_user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  /** Optional link data for context */
  booking_ref?: string;
}

export interface BackendReviewDTO {
  id: string;
  booking_ref: string;
  hotel_id: string;
  client_user_id: string;
  client_full_name: string;
  rating: number;       // 1–5
  comment: string;
  created_at: string;
  director_reply?: string;
  director_reply_at?: string;
}
