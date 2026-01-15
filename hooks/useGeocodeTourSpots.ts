import { useState, useEffect } from "react";
import { GenerateAiTourResponse } from "./generate-tour-with-ai/generate-ai-tour";
import { geocodeAddress } from "@/utils/location";

export type GeocodedSpotCoordinates = {
  latitude: number;
  longitude: number;
};

export type GeocodedSpot = {
  title: string;
  description: string;
  search_query: string;
  full_address: string;
  latitude: number;
  longitude: number;
  positionOrder: number;
  coordinates: GeocodedSpotCoordinates;
};

type UseGeocodeTourSpotsResult = {
  geocodedSpots: GeocodedSpot[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to geocode all tour spots that don't have coordinates
 */
export const useGeocodeTourSpots = (
  tourData: GenerateAiTourResponse | null
): UseGeocodeTourSpotsResult => {
  const [geocodedSpots, setGeocodedSpots] = useState<GeocodedSpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourData || !tourData.spots || tourData.spots.length === 0) {
      setGeocodedSpots([]);
      return;
    }

    const geocodeSpots = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const geocodedResults: GeocodedSpot[] = [];

        // Process spots sequentially to avoid rate limiting
        for (const spot of tourData.spots) {
          let latitude: number | null | undefined = spot.latitude;
          let longitude: number | null | undefined = spot.longitude;

          // If coordinates are missing, geocode the address
          if (!latitude || !longitude) {
            // Try full_address first, then search_query as fallback
            const coordinates = await geocodeAddress(
              spot.full_address,
              spot.search_query
            );

            if (coordinates && coordinates.latitude && coordinates.longitude) {
              latitude = coordinates.latitude;
              longitude = coordinates.longitude;
            } else {
              console.warn(
                `❌ Failed to geocode spot ${spot.positionOrder}: "${spot.title}"`
              );
              // Skip spots that can't be geocoded
              continue;
            }
          } else {
            console.log(
              `📍 Spot ${spot.positionOrder} already has coordinates: (${latitude}, ${longitude})`
            );
          }

          // Ensure we have valid coordinates before adding
          if (typeof latitude === "number" && typeof longitude === "number") {
            geocodedResults.push({
              ...spot,
              latitude,
              longitude,
              coordinates: {
                latitude,
                longitude,
              },
            });
          }
        }

        setGeocodedSpots(geocodedResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to geocode spots";
        setError(errorMessage);
        console.error("Geocoding error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeSpots();
  }, [tourData]);

  return { geocodedSpots, isLoading, error };
};
