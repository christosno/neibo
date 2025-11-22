import { Alert } from "react-native";
import * as Location from "expo-location";
import type { Coordinates } from "expo-maps/build/shared.types";

export type TripPoint = {
  id: string;
  coordinates: Coordinates;
  title?: string;
};

type CheckPointReachedOptions = {
  currentPosition: Coordinates;
  tripPoints: TripPoint[];
  reachedPoints: Set<string>;
  reachThreshold?: number;
  onPointReached?: (point: TripPoint) => void;
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  if (
    !coord1.latitude ||
    !coord1.longitude ||
    !coord2.latitude ||
    !coord2.longitude
  ) {
    return 0;
  }
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Interpolate between two coordinates
 * @param coord1 Start coordinate
 * @param coord2 End coordinate
 * @param t Interpolation factor (0 to 1)
 * @returns Interpolated coordinate
 */
export const interpolateCoordinates = (
  coord1: Coordinates,
  coord2: Coordinates,
  t: number
): Coordinates => {
  if (
    !coord1.latitude ||
    !coord1.longitude ||
    !coord2.latitude ||
    !coord2.longitude
  ) {
    return coord1;
  }
  return {
    latitude: coord1.latitude + (coord2.latitude - coord1.latitude) * t,
    longitude: coord1.longitude + (coord2.longitude - coord1.longitude) * t,
  };
};

/**
 * Check if current position has reached any trip points
 * @param options Configuration options
 * @returns Array of newly reached points
 */
export const checkPointReached = ({
  currentPosition,
  tripPoints,
  reachedPoints,
  reachThreshold = 50,
  onPointReached,
}: CheckPointReachedOptions): TripPoint[] => {
  if (!currentPosition.latitude || !currentPosition.longitude) {
    return [];
  }

  const newlyReached: TripPoint[] = [];

  tripPoints.forEach((point) => {
    // Skip if already reached
    if (reachedPoints.has(point.id)) return;

    const distance = calculateDistance(currentPosition, point.coordinates);

    if (distance <= reachThreshold) {
      // Mark as reached
      reachedPoints.add(point.id);
      newlyReached.push(point);

      // Call custom callback if provided, otherwise show default alert
      if (onPointReached) {
        onPointReached(point);
      } else {
        Alert.alert(
          "📍 Point Reached!",
          `You've reached ${point.title || "a waypoint"}!`,
          [{ text: "OK" }]
        );
      }
    }
  });

  return newlyReached;
};

/**
 * Check if Location.LocationObject has reached any trip points
 * Helper function for useTripWalking hook
 */
export const handlePointReachedFromLocation = (
  position: Location.LocationObject,
  options: Omit<CheckPointReachedOptions, "currentPosition">
): TripPoint[] => {
  const currentCoords: Coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  return checkPointReached({
    currentPosition: currentCoords,
    ...options,
  });
};

/**
 * Check if Coordinates has reached any trip points
 * Helper function for useTripSimulation hook
 */
export const handlePointReachedFromCoordinates = (
  currentPosition: Coordinates,
  options: Omit<CheckPointReachedOptions, "currentPosition">
): TripPoint[] => {
  return checkPointReached({
    currentPosition,
    ...options,
  });
};

/**
 * Calculate total distance of a trip (sum of distances between consecutive points)
 * @param tripPoints Array of trip points
 * @returns Total distance in meters
 */
export const calculateTotalTripDistance = (tripPoints: TripPoint[]): number => {
  if (tripPoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < tripPoints.length - 1; i++) {
    totalDistance += calculateDistance(
      tripPoints[i].coordinates,
      tripPoints[i + 1].coordinates
    );
  }
  return totalDistance;
};

/**
 * Get current position along the route based on progress (0 to 1)
 * @param progress Progress along the route (0 to 1)
 * @param tripPoints Array of trip points
 * @returns Current position coordinates or null if invalid
 */
export const getPositionAlongRoute = (
  progress: number,
  tripPoints: TripPoint[]
): Coordinates | null => {
  if (tripPoints.length < 2) return null;

  const totalSegments = tripPoints.length - 1;
  const segmentProgress = progress * totalSegments;
  const currentSegment = Math.floor(segmentProgress);
  const segmentT = segmentProgress - currentSegment;

  if (currentSegment >= totalSegments) {
    return tripPoints[tripPoints.length - 1].coordinates;
  }

  const start = tripPoints[currentSegment].coordinates;
  const end = tripPoints[currentSegment + 1].coordinates;
  return interpolateCoordinates(start, end, segmentT);
};

/**
 * Calculate simulation duration based on distance and speed multiplier
 * @param totalDistance Total distance in meters
 * @param speedMultiplier Speed multiplier (higher = faster simulation)
 * @param walkingSpeed Walking speed in m/s (default: 1.39 m/s = ~5 km/h)
 * @returns Duration in milliseconds
 */
export const calculateSimulationDuration = (
  totalDistance: number,
  speedMultiplier: number,
  walkingSpeed: number = 1.39
): number => {
  return (totalDistance / walkingSpeed) * (1 / speedMultiplier);
};
