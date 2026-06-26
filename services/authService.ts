import api from "./api";

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

export interface BackendUserDTO {
  user_id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  user_role: "CLIENT" | "PDG" | "DIRECTEUR";
  location?: string;
  gender?: string;
  birth_date?: string;
  home_address?: string;
  assigned_hotel_id?: string;
  access_token: string;
}

export interface AuthServiceResponse {
  user: BackendUserDTO;
  token: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthServiceResponse> {
  const { data } = await api.post<AuthServiceResponse>("/auth/login", {
    email: credentials.email,
    motDePasse: credentials.motDePasse,
  });
  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthServiceResponse> {
  const { data } = await api.post<AuthServiceResponse>("/auth/register", {
    nom: payload.nom,
    email: payload.email,
    motDePasse: payload.motDePasse,
    telephone: payload.telephone,
    localisation: payload.localisation,
    sexe: payload.sexe,
    dateNaissance: payload.dateNaissance,
    adresse: payload.adresse,
  });
  return data;
}
