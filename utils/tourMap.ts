import { defaultCameraPosition } from "@/constants/defaultPosition";
import { CameraPosition } from "expo-maps";

type SpotWithCoordinates = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

/**
 * Calculate camera position to fit all markers
 */
export const calculateCameraPosition = <T extends SpotWithCoordinates>(
  spots: T[]
): CameraPosition => {
  if (spots.length === 0) {
    return defaultCameraPosition;
  }

  if (spots.length === 1) {
    return {
      coordinates: spots[0].coordinates,
      zoom: 15,
    };
  }

  // Calculate bounding box
  const latitudes = spots.map((spot) => spot.coordinates.latitude);
  const longitudes = spots.map((spot) => spot.coordinates.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  // Calculate center
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate zoom level based on bounding box
  const latDelta = maxLat - minLat;
  const lngDelta = maxLng - minLng;
  const maxDelta = Math.max(latDelta, lngDelta);

  // Approximate zoom level (you may need to adjust this)
  let zoom = 13;
  if (maxDelta < 0.01) zoom = 15;
  else if (maxDelta < 0.05) zoom = 13;
  else if (maxDelta < 0.1) zoom = 11;
  else zoom = 10;

  return {
    coordinates: {
      latitude: centerLat,
      longitude: centerLng,
    },
    zoom,
  };
};
