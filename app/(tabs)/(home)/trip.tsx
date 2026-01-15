import { Platform, StyleSheet, Pressable } from "react-native";
import { useAiTourStore } from "@/hooks/useAiTourStore";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { Notification } from "@/ui-kit/feedback/Notification";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { SpotDescriptionModal } from "@/ui-kit/feedback/SpotDescriptionModal";
import {
  useGeocodeTourSpots,
  type GeocodedSpot,
} from "@/hooks/useGeocodeTourSpots";
import { AppleMaps } from "expo-maps";
import { useMemo, useRef, useState } from "react";
import { defaultCameraPosition } from "@/constants/defaultPosition";
import type { CameraPosition } from "expo-maps/build/shared.types";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentRef } from "react";
import { useGetCurrentPosition } from "@/hooks/useGetCurrentPosition";
import { useRequestLocationPermissions } from "@/hooks/useRequestLocationPermissions";
import { useProximityDetection } from "@/hooks/useProximityDetection";

/**
 * Calculate camera position to fit all markers
 */
const calculateCameraPosition = (spots: GeocodedSpot[]): CameraPosition => {
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

export default function Trip() {
  const tourData = useAiTourStore((state) => {
    return state.tourData;
  });
  console.log("👉 ~ Trip ~ tourData:", tourData);
  const { geocodedSpots, isLoading, error } = useGeocodeTourSpots(tourData);
  const mapRef = useRef<ComponentRef<typeof AppleMaps.View>>(null);
  const [currentCameraPosition, setCurrentCameraPosition] =
    useState<CameraPosition>(defaultCameraPosition);

  // Request location permissions
  useRequestLocationPermissions();

  // Get and watch user location
  const { coordinates: userLocation } = useGetCurrentPosition({
    watch: true,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  // Monitor distance to spots and show description when within 40 meters
  const { nearbySpot, clearNearbySpot } = useProximityDetection(
    userLocation,
    geocodedSpots,
    { proximityThreshold: 40 }
  );

  // Calculate camera position to show all markers (must be before early returns)
  const cameraPosition = useMemo(() => {
    if (geocodedSpots.length === 0) {
      return defaultCameraPosition;
    }
    const calculated = calculateCameraPosition(geocodedSpots);
    setCurrentCameraPosition(calculated);
    return calculated;
  }, [geocodedSpots]);

  // Sort spots by positionOrder to ensure correct route order
  const sortedSpots = useMemo(() => {
    return [...geocodedSpots].sort((a, b) => a.positionOrder - b.positionOrder);
  }, [geocodedSpots]);

  // Prepare markers for the map (must be before early returns)
  const markers = useMemo(() => {
    const spotMarkers = sortedSpots.map((spot, index) => ({
      key: `spot-${spot.positionOrder}-${index}`,
      coordinates: spot.coordinates,
      title: spot.title,
      subtitle: spot.description,
    }));

    // Add user location marker if available
    if (userLocation) {
      spotMarkers.push({
        key: "user-location",
        coordinates: userLocation,
        title: "Your Location",
        subtitle: "You are here",
      });
    }

    return spotMarkers;
  }, [sortedSpots, userLocation]);

  // Create polyline route connecting all spots in order
  const routePolyline = useMemo(() => {
    if (sortedSpots.length < 2) {
      return null;
    }

    return {
      id: "tour-route",
      coordinates: sortedSpots.map((spot) => spot.coordinates),
      color: "#365314", // Orange color for the route
      width: 2,
    };
  }, [sortedSpots]);

  const handleZoomIn = () => {
    if (!mapRef.current || !currentCameraPosition.coordinates) return;
    const currentZoom = currentCameraPosition.zoom || 13;
    const newZoom = Math.min(currentZoom + 1, 20);
    const newCameraPosition: CameraPosition = {
      coordinates: currentCameraPosition.coordinates,
      zoom: newZoom,
    };
    setCurrentCameraPosition(newCameraPosition);
    mapRef.current.setCameraPosition(newCameraPosition);
  };

  const handleZoomOut = () => {
    if (!mapRef.current || !currentCameraPosition.coordinates) return;
    const currentZoom = currentCameraPosition.zoom || 13;
    const newZoom = Math.max(currentZoom - 1, 3);
    const newCameraPosition: CameraPosition = {
      coordinates: currentCameraPosition.coordinates,
      zoom: newZoom,
    };
    setCurrentCameraPosition(newCameraPosition);
    mapRef.current.setCameraPosition(newCameraPosition);
  };

  if (!tourData) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message="Not able to generate tour"
          type="error"
        />
      </UIView>
    );
  }

  // iOS only - show message for other platforms
  if (Platform.OS !== "ios") {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Not Available"
          message="Map view is currently only available on iOS"
          type="info"
        />
      </UIView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <UIView gap="medium" mainAxis="center" crossAxis="center">
          <UIDotsLoader />
          <UIText color="slateLight">Geocoding tour spots...</UIText>
        </UIView>
      </UIView>
    );
  }

  // Error state
  if (error) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification title="Error" message={error} type="error" />
      </UIView>
    );
  }

  // No spots geocoded
  if (geocodedSpots.length === 0) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="No Spots Found"
          message="Unable to geocode any tour spots"
          type="error"
        />
      </UIView>
    );
  }

  return (
    <UIView expanded color="slateDark">
      <AppleMaps.View
        ref={mapRef}
        style={{ flex: 1 }}
        cameraPosition={cameraPosition}
        markers={markers}
        polylines={routePolyline ? [routePolyline] : []}
        onMarkerClick={(marker) => {
          console.log("Marker clicked:", marker);
        }}
      />
      {/* Zoom Controls */}
      <UIView style={styles.zoomControls}>
        <Pressable style={styles.zoomButton} onPress={handleZoomIn}>
          <Ionicons name="add" size={24} color="#000" />
        </Pressable>
        <Pressable
          style={[styles.zoomButton, styles.zoomButtonBottom]}
          onPress={handleZoomOut}
        >
          <Ionicons name="remove" size={24} color="#000" />
        </Pressable>
      </UIView>

      {/* Spot Description Modal */}
      <SpotDescriptionModal
        spot={nearbySpot}
        visible={nearbySpot !== null}
        onClose={clearNearbySpot}
      />
    </UIView>
  );
}

const styles = StyleSheet.create({
  zoomControls: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  zoomButtonBottom: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
});
