import { useMemo } from "react";
import type { TourSpot } from "@/services/tours/get-tour-by-id";

export type TourGeocodedSpotCoordinates = {
  latitude: number;
  longitude: number;
};

export type TourGeocodedSpot = {
  title: string;
  description: string;
  search_query: string;
  full_address: string;
  positionOrder: number;
  coordinates: TourGeocodedSpotCoordinates;
  reach_radius: number;
  imageUrls: string[];
  audioUrl: string;
};

/**
 * Hook to convert TourSpot[] to GeocodedSpot[] format
 * Tour spots already have coordinates, so no geocoding is needed
 */
export const useTourSpots = (spots: TourSpot[] | undefined): TourGeocodedSpot[] => {
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
