import { useRef, useMemo, useState, ComponentRef } from "react";
import { StyleSheet, Platform, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppleMaps, GoogleMaps, Coordinates } from "expo-maps";
import { Ionicons } from "@expo/vector-icons";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { theme } from "@/theme";
import { defaultCameraPosition } from "@/constants/defaultPosition";
import { type SpotFormData } from "@/hooks/create-tour/useCreateTourForm";
import { SpotFormModal } from "./SpotFormModal";
import { Stepper } from "./Stepper";
import { WizardStep } from "./types";
import { AddressSearchInput } from "./AddressSearchInput";

type SpotsStepProps = {
  spots: SpotFormData[];
  currentStep: WizardStep;
  invalidSteps: WizardStep[];
  onStepPress: (step: WizardStep) => void;
  onAddSpot: (spotData: Omit<SpotFormData, "positionOrder">) => void;
  onRemoveSpot: (index: number) => void;
  onNext: () => void;
};

export function SpotsStep({
  spots,
  currentStep,
  invalidSteps,
  onStepPress,
  onAddSpot,
  onRemoveSpot,
  onNext,
}: SpotsStepProps) {
  const insets = useSafeAreaInsets();
  const appleMapRef = useRef<ComponentRef<typeof AppleMaps.View>>(null);
  const googleMapRef = useRef<ComponentRef<typeof GoogleMaps.View>>(null);
  const [spotModalVisible, setSpotModalVisible] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [cameraPosition, setCameraPosition] = useState(defaultCameraPosition);

  const handleAddressSelected = (place: {
    latitude: number;
    longitude: number;
    description: string;
  }) => {
    // Update camera position state (map will re-render with new position)
    setCameraPosition({
      coordinates: {
        latitude: place.latitude,
        longitude: place.longitude,
      },
      zoom: 16,
    });

    // Select as spot and open the form
    setSelectedCoordinates({
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setSpotModalVisible(true);
  };

  const handleMapPress = (event: { coordinates: Coordinates }) => {
    const { latitude, longitude } = event.coordinates;
    if (latitude === undefined || longitude === undefined) return;
    setSelectedCoordinates({ latitude, longitude });
    setSpotModalVisible(true);
  };

  const handleAddSpot = (spotData: Omit<SpotFormData, "positionOrder">) => {
    setSpotModalVisible(false);
    setTimeout(() => {
      onAddSpot(spotData);
      setSelectedCoordinates(null);
    }, 100);
  };

  const handleCloseSpotModal = () => {
    setSpotModalVisible(false);
    setSelectedCoordinates(null);
  };

  const markers = useMemo(() => {
    return spots.map((spot, index) => ({
      id: `spot-${index}`,
      coordinates: {
        latitude: spot.latitude,
        longitude: spot.longitude,
      },
      title: spot.title,
      systemImage: "mappin.circle.fill",
      tintColor: theme.colors.green,
    }));
  }, [spots]);

  return (
    <UIView expanded color="slateDark">
      <Stepper
        currentStep={currentStep}
        onStepPress={onStepPress}
        invalidSteps={invalidSteps}
      />

      {/* Instructions */}
      <UIView padding="medium" color="slate">
        <UIView row mainAxis="space-between" crossAxis="center">
          <UIText color="slateLight" size="small">
            Tap on the map to add spots
          </UIText>
          <UIText color="yellow" size="small">
            {spots.length} spot{spots.length !== 1 ? "s" : ""} added
          </UIText>
        </UIView>
      </UIView>

      {/* Map */}
      <UIView expanded>
        <AddressSearchInput onPlaceSelected={handleAddressSelected} />
        {Platform.OS === "ios" ? (
          <AppleMaps.View
            ref={appleMapRef}
            style={styles.map}
            cameraPosition={cameraPosition}
            markers={markers}
            onMapClick={handleMapPress}
          />
        ) : (
          <GoogleMaps.View
            ref={googleMapRef}
            style={styles.map}
            cameraPosition={cameraPosition}
            markers={markers}
            onMapClick={handleMapPress}
          />
        )}
      </UIView>

      {/* Spots list */}
      {spots.length > 0 && (
        <UIView style={styles.spotsListContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.spotsListContent}
          >
            {spots.map((spot, index) => (
              <UIView
                key={`spot-${index}`}
                color="slate"
                padding="medium"
                borderRadius="medium"
                style={styles.spotCard}
              >
                <UIView row mainAxis="space-between" crossAxis="center">
                  <UIView expanded>
                    <UIText color="yellow" size="small" align="left">
                      {index + 1}. {spot.title}
                    </UIText>
                    {spot.description && (
                      <UIText
                        color="slateLight"
                        size="small"
                        align="left"
                        numberOfLines={1}
                      >
                        {spot.description}
                      </UIText>
                    )}
                  </UIView>
                  <Pressable
                    onPress={() => onRemoveSpot(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.colors.error}
                    />
                  </Pressable>
                </UIView>
              </UIView>
            ))}
          </ScrollView>
        </UIView>
      )}

      {/* Next button */}
      <UIView
        padding="large"
        color="slateDark"
        style={{ paddingBottom: insets.bottom + theme.spacing.large }}
      >
        {spots.length === 0 && (
          <UIView paddingBottom="small">
            <UIText color="slateLight" size="small" align="center">
              Add at least one spot to continue
            </UIText>
          </UIView>
        )}
        <UIButton
          variant="outlined"
          extended
          disabled={spots.length === 0}
          onPress={onNext}
        >
          Next: Review Tour
        </UIButton>
      </UIView>

      {/* Spot form modal */}
      <SpotFormModal
        visible={spotModalVisible}
        onClose={handleCloseSpotModal}
        onSubmit={handleAddSpot}
        coordinates={selectedCoordinates}
      />
      <UIVerticalSpacer height={insets.bottom} />
    </UIView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  spotsListContainer: {
    maxHeight: 100,
    backgroundColor: theme.colors.slateDark,
  },
  spotsListContent: {
    padding: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  spotCard: {
    minWidth: 150,
    maxWidth: 200,
  },
  removeButton: {
    padding: 4,
  },
});
