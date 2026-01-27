import { useState, useEffect, useMemo } from "react";
import { GenerateAiTourResponse } from "../generate-tour-with-ai/generate-ai-tour";
import { geocodeAddress } from "@/utils/location";

export type AiGeocodedSpotCoordinates = {
  latitude: number;
  longitude: number;
};

export type AiGeocodedSpot = {
  title: string;
  description: string;
  search_query: string;
  full_address: string;
  positionOrder: number;
  coordinates: AiGeocodedSpotCoordinates;
};

type UseAiGeocodeTourSpotsResult = {
  geocodedSpots: AiGeocodedSpot[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to geocode all AI tour spots that don't have coordinates
 */
export const useAiGeocodeTourSpots = (
  tourData: GenerateAiTourResponse | null
): UseAiGeocodeTourSpotsResult => {
  const [geocodedSpots, setGeocodedSpots] = useState<AiGeocodedSpot[]>([]);
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
        const geocodedResults: AiGeocodedSpot[] = [];

        // Process spots sequentially to avoid rate limiting
        for (const spot of tourData.spots) {
          const coordinates = await geocodeAddress(
            spot.full_address,
            spot.search_query
          );

          if (coordinates && coordinates.latitude && coordinates.longitude) {
            geocodedResults.push({
              ...spot,
              coordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              },
            });
          } else {
            console.warn(
              `❌ Failed to geocode spot ${spot.positionOrder}: "${spot.title}"`
            );
            continue;
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

  // Sort spots by positionOrder to ensure correct route order
  const sortedSpots = useMemo(() => {
    return [...geocodedSpots].sort((a, b) => a.positionOrder - b.positionOrder);
  }, [geocodedSpots]);

  return { geocodedSpots: sortedSpots, isLoading, error };
};
