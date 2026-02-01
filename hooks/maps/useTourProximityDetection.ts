import { useState, useEffect } from "react";
import type { Coordinates } from "@/hooks/maps/useGetCurrentPosition";
import { calculateDistance } from "@/utils/location";
import type { TourGeocodedSpot } from "./useTourSpots";

type UseTourProximityDetectionResult = {
  nearbySpot: TourGeocodedSpot | null;
  clearNearbySpot: () => void;
};

/**
 * Hook to detect when user is within proximity threshold of tour spots
 * Uses each spot's individual reach_radius for proximity detection
 * @param userLocation Current user coordinates
 * @param spots Array of tour spots with reach_radius
 * @returns nearbySpot and function to clear it
 */
export const useTourProximityDetection = (
  userLocation: Coordinates | null,
  spots: TourGeocodedSpot[]
): UseTourProximityDetectionResult => {
  const [nearbySpot, setNearbySpot] = useState<TourGeocodedSpot | null>(null);
  const [shownSpots, setShownSpots] = useState<Set<number>>(new Set());

  // Monitor distance to spots and show description when within reach_radius
  useEffect(() => {
    if (!userLocation || spots.length === 0) {
      return;
    }

    for (const spot of spots) {
      const distance = calculateDistance(userLocation, spot.coordinates);

      if (
        distance <= spot.reach_radius &&
        !shownSpots.has(spot.positionOrder)
      ) {
        // User is within threshold of this spot and hasn't seen it yet
        setNearbySpot(spot);
        setShownSpots((prev) => new Set(prev).add(spot.positionOrder));
        break; // Only show one spot at a time
      }
    }
  }, [userLocation, spots, shownSpots]);

  const clearNearbySpot = () => {
    setNearbySpot(null);
  };

  return { nearbySpot, clearNearbySpot };
};
