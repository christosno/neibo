import type { Coordinates } from "expo-maps/build/shared.types";
import { useState } from "react";

type TripPoint = {
  id: string;
  coordinates: Coordinates;
  title?: string;
};

export const useTripPoints = () => {
  const [tripPoints, setTripPoints] = useState<TripPoint[]>([]);

  const handleMapClick = (event: { coordinates: Coordinates }) => {
    const newPoint: TripPoint = {
      id: `point-${Date.now()}`,
      coordinates: event.coordinates,
      title: `Point ${tripPoints.length + 1}`,
    };
    setTripPoints([...tripPoints, newPoint]);
  };

  const clearTripPoints = () => {
    setTripPoints([]);
  };

  return {
    tripPoints,
    handleMapClick,
    clearTripPoints,
  };
};

export const useMarkers = ({
  tripPoints,
  isSimulating,
  simulationPosition,
}: {
  tripPoints: TripPoint[];
  isSimulating: boolean;
  simulationPosition: Coordinates | null;
}) => {
  const markers = tripPoints.map((point) => ({
    id: point.id,
    coordinates: point.coordinates,
    title: point.title,
  }));

  // Add simulation marker (walker) if simulating
  const allMarkers =
    isSimulating && simulationPosition
      ? [
          ...markers,
          {
            id: "walker",
            coordinates: simulationPosition,
            title: "You are here",
            tintColor: "#FF0000", // Red marker for walker
          },
        ]
      : markers;

  // Create polyline from trip points
  const polyline =
    tripPoints.length > 1
      ? [
          {
            id: "trip-route",
            coordinates: tripPoints.map((point) => point.coordinates),
            color: "#007AFF",
            width: 4,
          },
        ]
      : [];

  return {
    markers,
    allMarkers,
    polyline,
  };
};
