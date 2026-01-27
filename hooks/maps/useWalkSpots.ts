import { useMemo } from "react";
import type { WalkSpot } from "@/services/tours/get-walk-by-id";
import type { GeocodedSpot } from "./useGeocodeTourSpots";

export type WalkGeocodedSpot = GeocodedSpot & {
  reach_radius: number;
  imageUrls: string[];
  audioUrl: string;
};

/**
 * Hook to convert WalkSpot[] to GeocodedSpot[] format
 * Walk spots already have coordinates, so no geocoding is needed
 */
export const useWalkSpots = (spots: WalkSpot[] | undefined): WalkGeocodedSpot[] => {
  return useMemo(() => {
    if (!spots || spots.length === 0) {
      return [];
    }

    return spots
      .map((spot) => ({
        title: spot.title,
        description: spot.description,
        search_query: "",
        full_address: "",
        positionOrder: spot.positionOrder,
        reach_radius: spot.reach_radius,
        imageUrls: spot.imageUrls,
        audioUrl: spot.audioUrl,
        coordinates: {
          latitude: parseFloat(spot.latitude),
          longitude: parseFloat(spot.longitude),
        },
      }))
      .sort((a, b) => a.positionOrder - b.positionOrder);
  }, [spots]);
};
