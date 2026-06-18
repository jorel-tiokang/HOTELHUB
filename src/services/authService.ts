/**
 * authService.ts — Mock Authentication Service
 *
 * Public API that mimics a real REST auth backend.
 * To switch to a real backend, only change the code inside these functions;
 * callers (authStore.ts, etc.) remain completely untouched.
 */

import {
  mockUsers,
  fakeDelay,
  type BackendUserDTO,
} from "./mock-db";

export interface LoginCredentials {
  email: string;
  motDePasse: string;
}

export interface RegisterPayload {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  localisation: string;
  sexe: string;
  dateNaissance: string;
  adresse: string;
}

export interface AuthServiceResponse {
  user: BackendUserDTO;
  token: string;
}

// ── login ─────────────────────────────────────────────────────────────────────

export async function login(
  credentials: LoginCredentials
): Promise<AuthServiceResponse> {
  await fakeDelay(600);

  const found = mockUsers.find(
    (u) =>
      u.email_address.toLowerCase() === credentials.email.toLowerCase() &&
      u.hashed_password === credentials.motDePasse
  );

  if (!found) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  return { user: found, token: found.access_token };
}

// ── register ──────────────────────────────────────────────────────────────────

export async function register(
  payload: RegisterPayload
): Promise<AuthServiceResponse> {
  await fakeDelay(800);

  // Simulate duplicate e-mail check
  const existing = mockUsers.find(
    (u) => u.email_address.toLowerCase() === payload.email.toLowerCase()
  );
  if (existing) {
    throw new Error("Un compte avec cet email existe déjà.");
  }

  // Build and persist the new user in the in-memory "DB"
  const newUser: BackendUserDTO = {
    user_id: `u-client-${Date.now()}`,
    full_name: payload.nom,
    email_address: payload.email,
    phone_number: payload.telephone,
    user_role: "CLIENT",
    location: payload.localisation,
    gender: payload.sexe,
    birth_date: payload.dateNaissance,
    home_address: payload.adresse,
    hashed_password: payload.motDePasse,
    access_token: `mock-token-${Date.now()}`,
  };

  mockUsers.push(newUser);

  return { user: newUser, token: newUser.access_token };
}
