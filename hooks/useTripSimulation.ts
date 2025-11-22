import { useEffect, useState, useRef, useCallback } from "react";
import type { Coordinates } from "expo-maps/build/shared.types";
import {
  handlePointReachedFromCoordinates,
  calculateTotalTripDistance,
  getPositionAlongRoute,
  calculateSimulationDuration,
  type TripPoint,
} from "@/utils/location";

type UseTripSimulationOptions = {
  tripPoints: TripPoint[];
  enabled?: boolean;
  speedMultiplier?: number;
  onPointReached?: (point: TripPoint) => void;
  onPositionUpdate?: (position: Coordinates) => void;
};

export const useTripSimulation = ({
  tripPoints,
  enabled = false,
  speedMultiplier = 2,
  onPointReached,
  onPositionUpdate,
}: UseTripSimulationOptions) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPosition, setSimulationPosition] =
    useState<Coordinates | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reachedPointsRef = useRef<Set<string>>(new Set());
  // Use refs to store latest values for the interval callback
  const tripPointsRef = useRef(tripPoints);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  const onPointReachedRef = useRef(onPointReached);

  // Keep refs in sync
  useEffect(() => {
    tripPointsRef.current = tripPoints;
    onPositionUpdateRef.current = onPositionUpdate;
    onPointReachedRef.current = onPointReached;
  }, [tripPoints, onPositionUpdate, onPointReached]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (tripPoints.length < 2) return;

    // Stop any existing simulation first
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }

    setIsSimulating(true);
    setSimulationProgress(0);
    reachedPointsRef.current = new Set(); // Reset reached points

    // Calculate total distance and duration using current tripPoints
    const currentTripPoints = tripPointsRef.current;
    const totalDistance = calculateTotalTripDistance(currentTripPoints);

    // If distance is 0 or very small, use a default duration
    if (totalDistance === 0) {
      setIsSimulating(false);
      return;
    }

    const duration = calculateSimulationDuration(
      totalDistance,
      speedMultiplier
    );

    // Ensure minimum duration to prevent issues with very short intervals
    const minDuration = 100; // Minimum 100ms
    const actualDuration = Math.max(duration, minDuration);

    const steps = 100; // Number of animation steps
    const stepDuration = Math.max(actualDuration / steps, 10); // Minimum 10ms per step
    const stepProgress = 1 / steps;

    let currentProgress = 0;

    simulationIntervalRef.current = setInterval(() => {
      currentProgress += stepProgress;
      if (currentProgress >= 1) {
        currentProgress = 1;
        stopSimulation();
      }

      setSimulationProgress(currentProgress);
      // Use refs to get latest values
      const currentPoints = tripPointsRef.current;
      const position = getPositionAlongRoute(currentProgress, currentPoints);
      if (position) {
        setSimulationPosition(position);

        // Check if we've reached any points
        const REACH_THRESHOLD = 50; // meters - distance to consider "reached"
        handlePointReachedFromCoordinates(position, {
          tripPoints: currentPoints,
          reachedPoints: reachedPointsRef.current,
          reachThreshold: REACH_THRESHOLD,
          onPointReached: onPointReachedRef.current,
        });

        // Call position update callback
        if (onPositionUpdateRef.current) {
          onPositionUpdateRef.current(position);
        }
      }
    }, stepDuration);
  }, [tripPoints, speedMultiplier, stopSimulation]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setSimulationPosition(null);
    setSimulationProgress(0);
    reachedPointsRef.current = new Set();
  }, [stopSimulation]);

  // Auto-start/stop based on enabled prop
  useEffect(() => {
    if (enabled && tripPoints.length >= 2) {
      startSimulation();
    } else {
      stopSimulation();
    }
  }, [enabled, startSimulation, stopSimulation, tripPoints.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  return {
    isSimulating,
    simulationPosition,
    simulationProgress,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
};
