/**
 * authAdapter.ts
 *
 * Translates the backend UserDTO (snake_case, backend naming conventions)
 * into the clean AuthUser type that every frontend component expects.
 *
 * This is the ONLY place in the codebase that knows about both shapes.
 * When the real backend changes an attribute name, you fix it here — nowhere else.
 */

import type { BackendUserDTO, BackendRole } from "@/src/services/mock-db";
import type { AuthUser, Role } from "@/store/authStore";

// BackendRole and frontend Role happen to match in this project, but the
// explicit mapping table below makes a future divergence trivially easy to handle.
const ROLE_MAP: Record<BackendRole, Role> = {
  CLIENT: "CLIENT",
  PDG: "PDG",
  DIRECTEUR: "DIRECTEUR",
};

export function mapBackendUserToClient(dto: BackendUserDTO): AuthUser {
  return {
    id: dto.user_id,
    nom: dto.full_name,
    email: dto.email_address,
    telephone: dto.phone_number,
    role: ROLE_MAP[dto.user_role],
    localisation: dto.location,
    sexe: dto.gender,
    dateNaissance: dto.birth_date,
    adresse: dto.home_address,
    hotelId: dto.assigned_hotel_id,
  };
}
