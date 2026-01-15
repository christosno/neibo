import { useEffect, useState, useMemo } from "react";
import * as Location from "expo-location";

type UseGetCurrentPositionOptions = {
  watch?: boolean;
  accuracy?: Location.Accuracy;
  timeInterval?: number;
  distanceInterval?: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useGetCurrentPosition = (
  options: UseGetCurrentPositionOptions = {}
) => {
  const {
    watch = false,
    accuracy = Location.Accuracy.Balanced,
    timeInterval = 5000,
    distanceInterval = 10,
  } = options;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({});
        setLocation(initialLocation);

        // If watch is enabled, start watching for updates
        if (watch) {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy,
              timeInterval,
              distanceInterval,
            },
            (newLocation) => {
              setLocation(newLocation);
            }
          );
        }
      } catch (err) {
        setError("Failed to get location");
        console.error("Location error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [watch, accuracy, timeInterval, distanceInterval]);

  // Extract coordinates from location object
  const coordinates = useMemo<Coordinates | null>(() => {
    if (!location?.coords) {
      return null;
    }
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }, [location]);

  return { location, coordinates, isLoading, error };
};
