import { create } from "zustand";

interface HotelsFilterState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;

  searchQuery: string;
  priceMax: number;
  showAvailableOnly: boolean;
  userLocation: { lat: number; lng: number } | null;

  selectedAmenities: string[];
  selectedCity: string | null;
  selectedCountry: string | null;

  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setGuests: (n: number) => void;
  setSearchQuery: (q: string) => void;
  setPriceMax: (p: number) => void;
  toggleAvailableOnly: () => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  requestGeolocation: () => void;
  toggleAmenity: (amenity: string) => void;
  setSelectedCity: (city: string | null) => void;
  setSelectedCountry: (country: string | null) => void;
}

export const useHotelsFilterStore = create<HotelsFilterState>((set) => ({
  checkIn: null,
  checkOut: null,
  guests: 1,
  searchQuery: "",
  priceMax: 200000,
  showAvailableOnly: false,
  userLocation: null,
  selectedAmenities: [],
  selectedCity: null,
  selectedCountry: null,

  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setGuests: (n) => set({ guests: n }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setPriceMax: (p) => set({ priceMax: p }),
  toggleAvailableOnly: () =>
    set((state) => ({ showAvailableOnly: !state.showAvailableOnly })),
  setUserLocation: (loc) => set({ userLocation: loc }),
  toggleAmenity: (amenity) =>
    set((state) => ({
      selectedAmenities: state.selectedAmenities.includes(amenity)
        ? state.selectedAmenities.filter((a) => a !== amenity)
        : [...state.selectedAmenities, amenity],
    })),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedCountry: (country) => set({ selectedCountry: country, selectedCity: null }), // reset city when country changes

  requestGeolocation: () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        set({
          userLocation: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }),
      () => set({ userLocation: null })
    );
  },
}));

/** Haversine distance in km between two coordinates */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinDLng *
      sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}