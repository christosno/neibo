import { defaultCameraPosition } from "@/constants/defaultPosition";
import { useGeocodeTourSpots } from "@/hooks/maps/useGeocodeTourSpots";
import { useAiTourStore } from "@/hooks/useAiTourStore";
import { useSimulateTour } from "@/simulation/useSimulateTour";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { calculateCameraPosition } from "@/utils/tourMap";
import { GoogleMaps } from "expo-maps";
import { useMemo } from "react";
import { Notification } from "@/ui-kit/feedback/Notification";
import { SpotDescriptionModal } from "@/ui-kit/feedback/SpotDescriptionModal";
import { useProximityDetection } from "@/hooks/maps/useProximityDetection";
import { useCreatePolylines } from "@/hooks/maps/useCreatePolylines";

export function GoogleMapsComponent() {
  const tourData = useAiTourStore((state) => {
    return state.tourData;
  });
  const { geocodedSpots, isLoading, error } = useGeocodeTourSpots(tourData);

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
    return calculated;
  }, [geocodedSpots]);
  

  const googleMarkers = useMemo(() => {
    const spotMarkers = geocodedSpots.map((spot, index) => ({
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
  }, [geocodedSpots, userLocation]);

  const {polyline: routePolyline, isLoading: routePolylineLoading} = useCreatePolylines(geocodedSpots);

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
