import { create } from "zustand";
import { hotelsData } from "@/mocks/hotelsData";
import type { Hotel, Room } from "@/services/hotel";

interface HotelsStoreState {
  hotels: Hotel[];
  addRoom: (hotelId: string, room: Room) => void;
  updateRoom: (hotelId: string, room: Room) => void;
  deleteRoom: (hotelId: string, roomId: string) => void;
  toggleRoomStatus: (hotelId: string, roomId: string) => void;
  getHotelRooms: (hotelId: string) => Room[];
  updateHotel: (hotelId: string, updates: Partial<Hotel>) => void;
}

export const useHotelsStore = create<HotelsStoreState>((set, get) => ({
  // Deep-copy so the original hotelsData array is never mutated
  hotels: hotelsData.map((h) => ({
    ...h,
    rooms: h.rooms.map((r) => ({ ...r })),
  })),

  addRoom: (hotelId, room) =>
    set((state) => ({
      hotels: state.hotels.map((h) =>
        h.id === hotelId ? { ...h, rooms: [...h.rooms, room] } : h
      ),
    })),

  updateRoom: (hotelId, room) =>
    set((state) => ({
      hotels: state.hotels.map((h) =>
        h.id === hotelId
          ? { ...h, rooms: h.rooms.map((r) => (r.id === room.id ? room : r)) }
          : h
      ),
    })),

  deleteRoom: (hotelId, roomId) =>
    set((state) => ({
      hotels: state.hotels.map((h) =>
        h.id === hotelId
          ? { ...h, rooms: h.rooms.filter((r) => r.id !== roomId) }
          : h
      ),
    })),

  toggleRoomStatus: (hotelId, roomId) =>
    set((state) => ({
      hotels: state.hotels.map((h) =>
        h.id === hotelId
          ? {
              ...h,
              rooms: h.rooms.map((r) =>
                r.id === roomId
                  ? {
                      ...r,
                      statut:
                        r.statut === "DISPONIBLE"
                          ? "INDISPONIBLE"
                          : "DISPONIBLE",
                    }
                  : r
              ),
            }
          : h
      ),
    })),

  getHotelRooms: (hotelId) =>
    get().hotels.find((h) => h.id === hotelId)?.rooms ?? [],

  updateHotel: (hotelId, updates) =>
    set((state) => ({
      hotels: state.hotels.map((h) =>
        h.id === hotelId ? { ...h, ...updates } : h
      ),
    })),
}));
