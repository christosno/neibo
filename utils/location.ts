import * as Location from "expo-location";
import type { Coordinates } from "expo-maps/build/shared.types";

export type TripPoint = {
  id: string;
  coordinates: Coordinates;
  title?: string;
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
    return Infinity;
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
 * Geocode an address to get coordinates
 * Tries multiple address formats if the first attempt fails
 * @param address Full address string
 * @param searchQuery Search query string
 * @returns Coordinates or null if geocoding fails
 */
export const geocodeAddress = async (
  address: string,
  searchQuery?: string
): Promise<Coordinates | null> => {
  // Try primary address first
  try {
    const results = await Location.geocodeAsync(address);
    if (results && results.length > 0) {
      const location = results[0];
      return {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
  } catch (error) {
    console.warn(`⚠️ Geocoding failed for "${address}":`, error);
  }

  // Try fallback address if provided
  if (searchQuery && searchQuery !== address) {
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const location = results[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
    } catch (error) {
      console.warn(`⚠️ Geocoding failed for fallback "${searchQuery}":`, error);
    }
  }
  return null;
};
