import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { AppleMaps } from "expo-maps";
import { useRef } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import type { AppleMapsViewType } from "expo-maps/build/apple/AppleMaps.types";
import { useGetCurrentPosition, useTripSimulation } from "@/hooks";
import { defaultCameraPosition } from "@/constants";
import { useMarkers, useTripPoints } from "@/hooks/useTripPoints";

export default function Trip() {
  const mapRef = useRef<AppleMapsViewType | null>(null);
  const { tripPoints, handleMapClick, clearTripPoints } = useTripPoints();

  const {
    isSimulating,
    simulationPosition,
    simulationProgress,
    startSimulation,
    stopSimulation,
    resetSimulation,
  } = useTripSimulation({
    tripPoints,
    speedMultiplier: 2,
    onPositionUpdate: (position) => {
      // Update camera to follow the walker
      if (mapRef.current && position.latitude && position.longitude) {
        mapRef.current.setCameraPosition({
          coordinates: position,
          zoom: 17,
        });
      }
    },
  });

  const { location, isLoading, error } = useGetCurrentPosition();
  const { allMarkers, polyline } = useMarkers({
    tripPoints,
    isSimulating,
    simulationPosition,
  });

  const cameraPosition = location
    ? {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 15,
      }
    : defaultCameraPosition;

  // Clear all trip points
  const clearTrip = () => {
    clearTripPoints();
    resetSimulation();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <UIText style={styles.loadingText}>Getting your location...</UIText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <UIText style={styles.errorText}>{error}</UIText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <>
          <AppleMaps.View
            ref={(ref) => {
              if (ref) {
                mapRef.current = ref;
              }
            }}
            style={{ flex: 1 }}
            cameraPosition={
              isSimulating && simulationPosition
                ? {
                    coordinates: simulationPosition,
                    zoom: 17,
                  }
                : cameraPosition
            }
            properties={{
              isMyLocationEnabled: !isSimulating, // Disable user location during simulation
            }}
            markers={allMarkers}
            polylines={polyline}
            onMapClick={isSimulating ? undefined : handleMapClick}
          />
          {tripPoints.length > 0 && (
            <View style={styles.controlsContainer}>
              <View style={styles.infoContainer}>
                <UIText>
                  {tripPoints.length} point{tripPoints.length !== 1 ? "s" : ""}{" "}
                  added
                </UIText>
                {isSimulating && (
                  <UIText style={styles.simulationText}>
                    Walking... {Math.round(simulationProgress * 100)}%
                  </UIText>
                )}
              </View>
              <View style={styles.buttonRow}>
                {tripPoints.length >= 2 && (
                  <UIButton
                    variant="filled"
                    onPress={isSimulating ? stopSimulation : startSimulation}
                    style={styles.simulateButton}
                  >
                    {isSimulating ? "Stop" : "Start Walk"}
                  </UIButton>
                )}
                <UIButton variant="outlined" onPress={clearTrip}>
                  Clear
                </UIButton>
              </View>
            </View>
          )}
        </>
      ) : (
        <UIText>Need to create a android key for this</UIText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 12,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  simulateButton: {
    flex: 1,
  },
  simulationText: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
});
