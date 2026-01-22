import { useAiTourStore } from "@/hooks/useAiTourStore";
import { useGeocodeTourSpots } from "@/hooks/maps/useGeocodeTourSpots";
import { AppleMaps, CameraPosition } from "expo-maps";
import { ComponentRef, useMemo, useRef, useState } from "react";
import { defaultCameraPosition } from "@/constants/defaultPosition";
import { useSimulateTour } from "@/simulation/useSimulateTour";
import { calculateCameraPosition } from "@/utils/tourMap";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIText } from "@/ui-kit/typography/UIText";
import { Notification } from "@/ui-kit/feedback/Notification";
import { Pressable, StyleSheet } from "react-native";
import { SpotDescriptionModal } from "@/ui-kit/feedback/SpotDescriptionModal";
import { Ionicons } from "@expo/vector-icons";
import { useProximityDetection } from "@/hooks/maps/useProximityDetection";
import { useCreatePolylines } from "@/hooks/maps/useCreatePolylines";
import { useGetCurrentPosition } from "@/hooks";

export function AppleMapsComponent() {
  const tourData = useAiTourStore((state) => {
    return state.tourData;
  });
  const { geocodedSpots, isLoading, error } = useGeocodeTourSpots(tourData);
  const mapRef = useRef<ComponentRef<typeof AppleMaps.View>>(null);
  const [currentCameraPosition, setCurrentCameraPosition] =
    useState<CameraPosition>(defaultCameraPosition);

  // // Get and watch user location
  // const { coordinates: userLocation } = useGetCurrentPosition({
  //   watch: true,
  //   timeInterval: 5000,
  //   distanceInterval: 10,
  // });

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  const { userLocation } = useSimulateTour(
    geocodedSpots.map((spot) => ({
      latitude: spot.coordinates.latitude,
      longitude: spot.coordinates.longitude,
    }))
  );

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

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
    const sorted = [...geocodedSpots].sort((a, b) => a.positionOrder - b.positionOrder);
    return sorted;
  }, [geocodedSpots]);

  // Prepare markers for the map (must be before early returns)
  const appleMarkers = useMemo(() => {
    const spotMarkers = sortedSpots.map((spot, index) => ({
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
  }, [sortedSpots, userLocation]);

  const {polyline: routePolyline, isLoading: routePolylineLoading} = useCreatePolylines(sortedSpots);

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

  // Loading state
  if (isLoading || routePolylineLoading) {
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
