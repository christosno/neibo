import { useState, useEffect } from "react";
import type { Coordinates } from "@/hooks/maps/useGetCurrentPosition";
import { calculateDistance } from "@/utils/location";
import { AiGeocodedSpot } from "./useAiGeocodeTourSpots";

type UseAiProximityDetectionOptions = {
  proximityThreshold?: number; // in meters, default 40
};

type UseAiProximityDetectionResult = {
  nearbySpot: AiGeocodedSpot | null;
  clearNearbySpot: () => void;
};

/**
 * Hook to detect when user is within proximity threshold of AI tour spots
 * @param userLocation Current user coordinates
 * @param spots Array of geocoded AI tour spots
 * @param options Configuration options
 * @returns nearbySpot and function to clear it
 */
export const useAiProximityDetection = (
  userLocation: Coordinates | null,
  spots: AiGeocodedSpot[],
  options: UseAiProximityDetectionOptions = {}
): UseAiProximityDetectionResult => {
  const { proximityThreshold = 40 } = options;
  const [nearbySpot, setNearbySpot] = useState<AiGeocodedSpot | null>(null);
  const [shownSpots, setShownSpots] = useState<Set<number>>(new Set());

  // Monitor distance to spots and show description when within threshold
  useEffect(() => {
    if (!userLocation || spots.length === 0) {
      return;
    }

    for (const spot of spots) {
      const distance = calculateDistance(userLocation, spot.coordinates);

      if (
        distance <= proximityThreshold &&
        !shownSpots.has(spot.positionOrder)
      ) {
        // User is within threshold of this spot and hasn't seen it yet
        setNearbySpot(spot);
        setShownSpots((prev) => new Set(prev).add(spot.positionOrder));
        break; // Only show one spot at a time
      }
    }
  }, [userLocation, spots, proximityThreshold, shownSpots]);

  const clearNearbySpot = () => {
    setNearbySpot(null);
  };

  return { nearbySpot, clearNearbySpot };
};
