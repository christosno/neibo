import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useGetCurrentPosition = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }
        const loc = await Location.getCurrentPositionAsync();
        setLocation(loc);
      } catch (err) {
        setError("Failed to get location");
        console.error("Location error:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { location, isLoading, error };
};
