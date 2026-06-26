import api from "./api";

export interface Avis {
  id: string;
  hotelId: string;
  clientId: string;
  note: number;
  commentaire: string;
  createdAt: string;
}

export async function getAvisByHotel(hotelId: string): Promise<Avis[]> {
  const { data } = await api.get<Avis[]>(`/hotels/${hotelId}/avis`);
  return data;
}

export async function createAvis(
  hotelId: string,
  avisData: { note: number; commentaire: string }
): Promise<Avis> {
  const { data } = await api.post<Avis>(
    `/hotels/${hotelId}/avis`,
    avisData
  );
  return data;
}
