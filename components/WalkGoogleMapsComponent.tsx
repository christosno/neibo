import { defaultCameraPosition } from "@/constants/defaultPosition";
import { useGetCurrentPosition } from "@/hooks/maps/useGetCurrentPosition";
import { useWalkProximityDetection } from "@/hooks/maps/useWalkProximityDetection";
import { useCreatePolylines } from "@/hooks/maps/useCreatePolylines";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { calculateCameraPosition } from "@/utils/tourMap";
import { GoogleMaps } from "expo-maps";
import { useMemo } from "react";
import { Notification } from "@/ui-kit/feedback/Notification";
import { SpotDescriptionModal } from "@/ui-kit/feedback/SpotDescriptionModal";
import type { WalkGeocodedSpot } from "@/hooks/maps/useWalkSpots";

type WalkGoogleMapsComponentProps = {
  spots: WalkGeocodedSpot[];
};

export function WalkGoogleMapsComponent({ spots }: WalkGoogleMapsComponentProps) {
  // Get and watch user location
  const { coordinates: userLocation } = useGetCurrentPosition({
    watch: true,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  // Monitor distance to spots and show description when within reach_radius
  const { nearbySpot, clearNearbySpot } = useWalkProximityDetection(
    userLocation,
    spots
  );

  // Calculate camera position to show all markers
  const cameraPosition = useMemo(() => {
    if (spots.length === 0) {
      return defaultCameraPosition;
    }
    return calculateCameraPosition(spots);
  }, [spots]);

  const googleMarkers = useMemo(() => {
    const spotMarkers = spots.map((spot, index) => ({
      id: `spot-${spot.positionOrder}-${index}`,
      coordinates: spot.coordinates,
      title: spot.title,
      draggable: false,
    }));

    if (userLocation) {
      spotMarkers.push({
        id: "user-location",
        coordinates: userLocation,
        title: "Your Location",
        draggable: false,
      });
    }
    return spotMarkers;
  }, [spots, userLocation]);

  const { polyline: routePolyline, isLoading: routePolylineLoading } =
    useCreatePolylines(spots);

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
      <GoogleMaps.View
        style={{ flex: 1 }}
        cameraPosition={cameraPosition}
        markers={googleMarkers}
        polylines={routePolyline ? [routePolyline] : []}
        onMarkerClick={(marker) => {
          console.log("Marker clicked:", marker);
        }}
      />

      {/* Spot Description Modal */}
      <SpotDescriptionModal
        spot={nearbySpot}
        visible={nearbySpot !== null}
        onClose={clearNearbySpot}
      />
    </UIView>
  );
}
