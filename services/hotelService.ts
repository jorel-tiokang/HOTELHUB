import api from "./api";
import type { Hotel } from "./hotel";

export interface HotelSearchParams {
  lat: number;
  lng: number;
  rayon?: number;
}

export async function searchHotels(
  params: HotelSearchParams
): Promise<Hotel[]> {
  const { data } = await api.get<Hotel[]>("/hotels", { params });
  return data;
}

export async function getHotelById(id: string): Promise<Hotel> {
  const { data } = await api.get<Hotel>(`/hotels/${id}`);
  return data;
}

export async function createHotel(
  hotelData: Partial<Hotel>
): Promise<Hotel> {
  const { data } = await api.post<Hotel>("/hotels", hotelData);
  return data;
}

export async function updateHotel(
  id: string,
  hotelData: Partial<Hotel>
): Promise<Hotel> {
  const { data } = await api.put<Hotel>(`/hotels/${id}`, hotelData);
  return data;
}
