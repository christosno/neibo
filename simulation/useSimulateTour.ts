import { useGetCurrentPosition, type Coordinates } from "@/hooks";
import { useEffect, useState, useRef } from "react";

export const useSimulateTour = (coordinates: Coordinates[]) => {
  // Get and watch user location
  const { coordinates: userStartLocation } = useGetCurrentPosition({
    watch: false,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  const [userLocation, setUserLocation] = useState<Coordinates | null>(
    userStartLocation
  );
  const currentTargetIndex = useRef<number>(0);

  useEffect(() => {
    if (userStartLocation) {
      setUserLocation(userStartLocation);
      currentTargetIndex.current = 0;
    }
  }, [userStartLocation]);

  useEffect(() => {
    if (!userLocation || coordinates.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setUserLocation((currentLocation) => {
        if (!currentLocation) return currentLocation;

        // If we've reached all coordinates, stop
        if (currentTargetIndex.current >= coordinates.length) {
          return currentLocation;
        }

        const target = coordinates[currentTargetIndex.current];
        const currentLat = currentLocation.latitude;
        const currentLng = currentLocation.longitude;
        const targetLat = target.latitude;
        const targetLng = target.longitude;

        // Calculate distance to target (simple Euclidean distance in degrees)
        const latDiff = targetLat - currentLat;
        const lngDiff = targetLng - currentLng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

        // If we're close enough to the target (within ~0.00027 degrees, roughly 30 meters)
        const threshold = 0.00027;
        if (distance < threshold) {
          // Move to next target
          currentTargetIndex.current += 1;

          // If there's a next target, continue, otherwise stay at current location
          if (currentTargetIndex.current < coordinates.length) {
            return currentLocation;
          }
          return currentLocation;
        }

        // Calculate direction vector (normalized)
        const directionLat = latDiff / distance;
        const directionLng = lngDiff / distance;

        // Move towards target (step size: ~0.0001 degrees per second, roughly 5 meters)
        const stepSize = 0.00005;
        const newLat = currentLat + directionLat * stepSize;
        const newLng = currentLng + directionLng * stepSize;

        return {
          latitude: newLat,
          longitude: newLng,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userLocation, coordinates]);

  return {
    userLocation,
  };
};
