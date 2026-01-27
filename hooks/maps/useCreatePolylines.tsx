import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import polyline from "@mapbox/polyline";

export type LatitudeLongitudeLiteral = {
  latitude: number;
  longitude: number;
};

type SpotWithCoordinates = {
  coordinates: LatitudeLongitudeLiteral;
};

type DirectionsLeg = {
  steps: {
    polyline: {
      points: string;
    };
  }[];
};

type DirectionsRoute = {
  legs: DirectionsLeg[];
  overview_polyline: {
    points: string;
  };
};

type DirectionsResponse = {
  routes: DirectionsRoute[];
  status: string;
};

const directionsUrl = "https://maps.googleapis.com/maps/api/directions/json";
const apiKey = Constants.expoConfig?.extra?.ROADS_API_KEY as string | undefined;

const fetchDirections = async (
  origin: LatitudeLongitudeLiteral,
  destination: LatitudeLongitudeLiteral,
  waypoints?: LatitudeLongitudeLiteral[]
): Promise<DirectionsResponse> => {
  if (!apiKey) {
    throw new Error("API_KEY is not set");
  }

  const originStr = `${origin.latitude},${origin.longitude}`;
  const destinationStr = `${destination.latitude},${destination.longitude}`;

  let waypointsStr = "";
  if (waypoints && waypoints.length > 0) {
    const limitedWaypoints = waypoints.slice(0, 23);
    waypointsStr = `&waypoints=${limitedWaypoints
      .map((w) => `${w.latitude},${w.longitude}`)
      .join("|")}`;
  }

  const url = `${directionsUrl}?origin=${originStr}&destination=${destinationStr}${waypointsStr}&mode=walking&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Directions API error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const decodePolyline = (encoded: string): LatitudeLongitudeLiteral[] => {
  const decoded = polyline.decode(encoded);
  return decoded.map(([lat, lng]: [number, number]) => ({
    latitude: lat,
    longitude: lng,
  }));
};

export function useCreatePolylines<T extends SpotWithCoordinates>(spots: T[]) {
  const {
    data: directionsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "directions",
      spots
        .map((s) => `${s.coordinates.latitude},${s.coordinates.longitude}`)
        .join("|"),
    ],
    queryFn: async () => {
      if (spots.length < 2) return null;

      const origin = spots[0].coordinates;
      const destination = spots[spots.length - 1].coordinates;
      const waypoints =
        spots.length > 2
          ? spots.slice(1, -1).map((s) => s.coordinates)
          : undefined;

      return fetchDirections(origin, destination, waypoints);
    },
    enabled: spots.length >= 2 && !!apiKey,
    staleTime: 5 * 60 * 1000,
  });

  const polylineResult = useMemo(() => {
    if (spots.length < 2) {
      return null;
    }

    let coordinates: LatitudeLongitudeLiteral[];

    if (directionsResponse?.routes && directionsResponse.routes.length > 0) {
      const route = directionsResponse.routes[0];
      coordinates = decodePolyline(route.overview_polyline.points);
    } else {
      coordinates = spots.map((spot) => spot.coordinates);
    }

    return {
      id: "tour-route",
      coordinates,
      color: "#365314",
      width: 2,
    };
  }, [spots, directionsResponse]);

  return {
    polyline: polylineResult,
    isLoading,
    error,
  };
}
