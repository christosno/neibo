import { useEffect, useState, useRef, useCallback } from "react";
import * as Location from "expo-location";
import {
  handlePointReachedFromLocation,
  type TripPoint,
} from "@/utils/location";

type UseTripWalkingOptions = {
  tripPoints: TripPoint[];
  enabled?: boolean;
  onPointReached?: (point: TripPoint) => void;
  onPositionUpdate?: (position: Location.LocationObject) => void;
  reachThreshold?: number; // meters
  updateInterval?: number; // milliseconds
};

export const useTripWalking = ({
  tripPoints,
  enabled = false,
  onPointReached,
  onPositionUpdate,
  reachThreshold = 50, // meters
  updateInterval = 1000, // 1 second
}: UseTripWalkingOptions) => {
  const [currentPosition, setCurrentPosition] =
    useState<Location.LocationObject | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reachedPointsRef = useRef<Set<string>>(new Set());
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null
  );
  // Use refs to store latest values for the watch callback
  const tripPointsRef = useRef(tripPoints);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  const onPointReachedRef = useRef(onPointReached);
  const reachThresholdRef = useRef(reachThreshold);

  // Keep refs in sync
  useEffect(() => {
    tripPointsRef.current = tripPoints;
    onPositionUpdateRef.current = onPositionUpdate;
    onPointReachedRef.current = onPointReached;
    reachThresholdRef.current = reachThreshold;
  }, [tripPoints, onPositionUpdate, onPointReached, reachThreshold]);

  // Start watching user's position
  const startWalking = useCallback(async () => {
    try {
      setError(null);

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      // Request background permissions for continuous tracking
      const backgroundStatus =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== "granted") {
        // Still allow foreground tracking
        console.warn("Background location permission not granted");
      }

      setIsWalking(true);
      reachedPointsRef.current = new Set(); // Reset reached points

      // Start watching position
      watchSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: updateInterval,
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          setCurrentPosition(location);

          // Check if reached any points (use refs to get latest values)
          handlePointReachedFromLocation(location, {
            tripPoints: tripPointsRef.current,
            reachedPoints: reachedPointsRef.current,
            reachThreshold: reachThresholdRef.current,
            onPointReached: onPointReachedRef.current,
          });

          // Call position update callback
          if (onPositionUpdateRef.current) {
            onPositionUpdateRef.current(location);
          }
        }
      );
    } catch (err) {
      setError("Failed to start location tracking");
      console.error("Location tracking error:", err);
      setIsWalking(false);
    }
  }, [updateInterval]);

  // Stop watching user's position
  const stopWalking = () => {
    if (watchSubscriptionRef.current) {
      watchSubscriptionRef.current.remove();
      watchSubscriptionRef.current = null;
    }
    setIsWalking(false);
    setCurrentPosition(null);
  };

  // Reset reached points
  const resetReachedPoints = () => {
    reachedPointsRef.current = new Set();
  };

  // Auto-start/stop based on enabled prop
  useEffect(() => {
    if (enabled && tripPoints.length >= 2) {
      startWalking();
    } else {
      stopWalking();
    }

    return () => {
      stopWalking();
    };
  }, [enabled, startWalking, tripPoints.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWalking();
    };
  }, []);

  return {
    currentPosition,
    isWalking,
    error,
    startWalking,
    stopWalking,
    resetReachedPoints,
  };
};
