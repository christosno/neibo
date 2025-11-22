import { useEffect } from "react";
import * as Location from "expo-location";

export const useRequestLocationPermissions = () => {
  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);
};
