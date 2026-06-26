import api from "./api";
import type { Room } from "./hotel";

export async function getChambresByHotel(hotelId: string): Promise<Room[]> {
  const { data } = await api.get<Room[]>("/chambres", {
    params: { hotelId },
  });
  return data;
}

export async function getChambreById(id: string): Promise<Room> {
  const { data } = await api.get<Room>(`/chambres/${id}`);
  return data;
}

export async function createChambre(
  chambreData: Partial<Room>
): Promise<Room> {
  const { data } = await api.post<Room>("/chambres", chambreData);
  return data;
}

export async function updateChambre(
  id: string,
  chambreData: Partial<Room>
): Promise<Room> {
  const { data } = await api.put<Room>(`/chambres/${id}`, chambreData);
  return data;
}

export async function deleteChambre(id: string): Promise<void> {
  await api.delete(`/chambres/${id}`);
}
