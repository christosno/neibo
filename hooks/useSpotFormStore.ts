import { create } from "zustand";

export type SpotFormResult = {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  reach_radius?: number;
  imageUrls?: string[];
};

type SpotFormStore = {
  pendingCoordinates: { latitude: number; longitude: number } | null;
  result: SpotFormResult | null;
  setPendingCoordinates: (
    coords: { latitude: number; longitude: number } | null
  ) => void;
  setResult: (result: SpotFormResult | null) => void;
  reset: () => void;
};

export const useSpotFormStore = create<SpotFormStore>((set) => ({
  pendingCoordinates: null,
  result: null,
  setPendingCoordinates: (coords) => set({ pendingCoordinates: coords }),
  setResult: (result) => set({ result }),
  reset: () => set({ pendingCoordinates: null, result: null }),
}));
