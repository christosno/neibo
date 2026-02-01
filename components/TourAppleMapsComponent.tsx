import { useGetCurrentPosition } from "@/hooks/maps/useGetCurrentPosition";
import { useTourProximityDetection } from "@/hooks/maps/useTourProximityDetection";
import { useCreatePolylines } from "@/hooks/maps/useCreatePolylines";
import { AppleMaps, CameraPosition } from "expo-maps";
import { ComponentRef, useMemo, useRef, useState } from "react";
import { defaultCameraPosition } from "@/constants/defaultPosition";
import { calculateCameraPosition } from "@/utils/tourMap";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIText } from "@/ui-kit/typography/UIText";
import { Notification } from "@/ui-kit/feedback/Notification";
import { Pressable, StyleSheet } from "react-native";
import { SpotDescriptionModal } from "@/ui-kit/feedback/SpotDescriptionModal";
import { Ionicons } from "@expo/vector-icons";
import type { TourGeocodedSpot } from "@/hooks/maps/useTourSpots";

type TourAppleMapsComponentProps = {
  spots: TourGeocodedSpot[];
};

export function TourAppleMapsComponent({ spots }: TourAppleMapsComponentProps) {
  const mapRef = useRef<ComponentRef<typeof AppleMaps.View>>(null);
  const [currentCameraPosition, setCurrentCameraPosition] =
    useState<CameraPosition>(defaultCameraPosition);

  // Get and watch user location
  const { coordinates: userLocation } = useGetCurrentPosition({
    watch: true,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  // Monitor distance to spots and show description when within reach_radius
  const { nearbySpot, clearNearbySpot } = useTourProximityDetection(
    userLocation,
    spots
  );

  // Calculate camera position to show all markers
  const cameraPosition = useMemo(() => {
    if (spots.length === 0) {
      return defaultCameraPosition;
    }
    const calculated = calculateCameraPosition(spots);
    setCurrentCameraPosition(calculated);
    return calculated;
  }, [spots]);

  // Prepare markers for the map
  const appleMarkers = useMemo(() => {
    const spotMarkers = spots.map((spot, index) => ({
      id: `spot-${spot.positionOrder}-${index}`,
      coordinates: spot.coordinates,
      title: spot.title,
      systemImage: "mappin.circle.fill",
      tintColor: "#365314", // Green color for tour spots
    }));

    // Add user location marker if available
    if (userLocation) {
      spotMarkers.push({
        id: "user-location",
        coordinates: userLocation,
        title: "Your Location",
        systemImage: "location.circle.fill",
        tintColor: "#3b82f6", // Blue color for user location
      });
    }

    return spotMarkers;
  }, [spots, userLocation]);

  const { polyline: routePolyline, isLoading: routePolylineLoading } =
    useCreatePolylines(spots);

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

  // Loading state for polylines
  if (routePolylineLoading) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <UIView gap="medium" mainAxis="center" crossAxis="center">
          <UIDotsLoader />
          <UIText color="slateLight">Loading route...</UIText>
        </UIView>
      </UIView>
    );
  }

  // No spots
  if (spots.length === 0) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="No Spots Found"
          message="This tour has no spots to display"
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
        markers={appleMarkers}
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
