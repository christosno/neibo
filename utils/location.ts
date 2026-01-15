import * as Location from "expo-location";
import type { Coordinates } from "expo-maps/build/shared.types";

export type TripPoint = {
  id: string;
  coordinates: Coordinates;
  title?: string;
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
