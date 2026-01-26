import { useState, useMemo, useRef, ComponentRef } from "react";
import {
  StyleSheet,
  Switch,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";
import { router } from "expo-router";
import { AppleMaps, GoogleMaps, Coordinates } from "expo-maps";
import { Ionicons } from "@expo/vector-icons";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { UIMultiSelect } from "@/ui-kit/inputs/UIMultiSelect";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { Notification } from "@/ui-kit/feedback/Notification";
import { theme } from "@/theme";
import { SpotFormModal } from "@/components/CreateTour/SpotFormModal";
import {
  useCreateTourForm,
  TOUR_TAGS,
  type SpotFormData,
  type CreateTourFormData,
} from "@/hooks/create-tour/useCreateTourForm";
import { useCreateTour } from "@/hooks/create-tour/useCreateTour";
import { defaultCameraPosition } from "@/constants/defaultPosition";

type WizardStep = "info" | "spots";

export default function CreateTour() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<WizardStep>("info");
  const [spotModalVisible, setSpotModalVisible] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<ComponentRef<typeof AppleMaps.View>>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useCreateTourForm();

  const { createTour, isPending, error } = useCreateTour();

  const spots = watch("spots");

  const handleMapPress = (event: { coordinates: Coordinates }) => {
    const { latitude, longitude } = event.coordinates;
    if (latitude === undefined || longitude === undefined) return;
    setSelectedCoordinates({ latitude, longitude });
    setSpotModalVisible(true);
  };

  const handleAddSpot = (spotData: Omit<SpotFormData, "positionOrder">) => {
    const newSpot: SpotFormData = {
      ...spotData,
      positionOrder: spots.length,
    };
    setValue("spots", [...spots, newSpot]);
  };

  const handleRemoveSpot = (index: number) => {
    const updatedSpots = spots
      .filter((_, i) => i !== index)
      .map((spot, i) => ({ ...spot, positionOrder: i }));
    setValue("spots", updatedSpots);
  };

  const handleNextStep = async () => {
    const isValid = await trigger(["name", "description"], { shouldFocus: true });
    if (isValid) {
      setStep("spots");
    }
  };

  const handlePreviousStep = () => {
    setStep("info");
  };

  const onSubmit = async (formData: CreateTourFormData) => {
    if (formData.spots.length === 0) {
      return;
    }

    try {
      await createTour(formData);
      reset();
      router.back();
    } catch (err) {
      console.log("Create tour error:", err);
    }
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

  if (step === "info") {
    return (
      <UIView expanded color="slateDark">
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          extraScrollHeight={100}
        >
          <UIView paddingHorizontal="large" paddingTop="large">
            <UIText size="large" align="left" color="yellow">
              Tour Information
            </UIText>
            <UIVerticalSpacer height={theme.spacing.large} />

            <UITextInput
              label="Tour Name *"
              control={control}
              name="name"
              placeholder="My Amazing Tour"
              hasError={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <UIVerticalSpacer height={theme.spacing.medium} />

            <UITextInput
              label="Description"
              control={control}
              name="description"
              placeholder="Describe your tour"
              multiline
              numberOfLines={30}
              height={150}
              hasError={!!errors.description}
              errorMessage={errors.description?.message}
            />

            <UIVerticalSpacer height={theme.spacing.medium} />

            <UITextInput
              label="Cover Image URL"
              control={control}
              name="coverImageUrl"
              placeholder="https://example.com/cover.jpg (optional)"
              keyboardType="url"
            />

            <UIVerticalSpacer height={theme.spacing.medium} />

            <UIView row gap="medium">
              <UIView expanded>
                <UITextInput
                  label="Duration (minutes)"
                  control={control}
                  name="duration_estimate"
                  placeholder="60"
                  keyboardType="numeric"
                />
              </UIView>
              <UIView expanded>
                <UITextInput
                  label="Distance (km)"
                  control={control}
                  name="distance_estimate"
                  placeholder="2.5"
                  keyboardType="numeric"
                />
              </UIView>
            </UIView>

            <UIVerticalSpacer height={theme.spacing.medium} />

            <UIView row crossAxis="center" mainAxis="space-between">
              <UIText size="small" color="yellow" align="left">
                Make tour public
              </UIText>
              <Controller
                control={control}
                name="isPublic"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{
                      false: theme.colors.slate,
                      true: theme.colors.yellow,
                    }}
                    thumbColor={theme.colors.white}
                  />
                )}
              />
            </UIView>

            <UIVerticalSpacer height={theme.spacing.large} />

            <UIText size="small" color="yellow" align="left">
              Tags
            </UIText>
            <UIVerticalSpacer height={theme.spacing.small} />

            <Controller
              control={control}
              name="tagIds"
              render={({ field: { onChange, value } }) => (
                <UIMultiSelect
                  placeholder="Select tags"
                  value={value || []}
                  onChange={onChange}
                  options={TOUR_TAGS.map((tag) => ({
                    label: tag,
                    value: tag,
                  }))}
                />
              )}
            />

            <UIVerticalSpacer height={theme.spacing.xLarge} />

            <UIButton variant="outlined" extended onPress={handleNextStep}>
              Next: Add Spots
            </UIButton>

            <UIVerticalSpacer height={theme.spacing.large + insets.bottom} />
          </UIView>
        </KeyboardAwareScrollView>
      </UIView>
    );
  }

  // Step 2: Map for adding spots
  return (
    <UIView expanded color="slateDark">
      {/* Header with back button */}
      <UIView
        row
        padding="medium"
        crossAxis="center"
        mainAxis="space-between"
        color="slateDark"
      >
        <Pressable onPress={handlePreviousStep} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.yellow} />
          <UIText color="yellow" size="medium">
            Back
          </UIText>
        </Pressable>
        <UIText color="yellow" size="medium">
          {spots.length} spot{spots.length !== 1 ? "s" : ""} added
        </UIText>
      </UIView>

      {/* Instructions */}
      <UIView padding="medium" color="slate">
        <UIText color="slateLight" size="small" align="center">
          Tap on the map to add spots to your tour
        </UIText>
      </UIView>

      {/* Map */}
      <UIView expanded>
        {Platform.OS === "ios" ? (
          <AppleMaps.View
            ref={mapRef}
            style={styles.map}
            cameraPosition={defaultCameraPosition}
            markers={markers}
            onMapClick={handleMapPress}
          />
        ) : (
          <GoogleMaps.View
            style={styles.map}
            cameraPosition={defaultCameraPosition}
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
                    onPress={() => handleRemoveSpot(index)}
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

      {/* Error notification */}
      {error && (
        <UIView padding="medium">
          <Notification
            title="Error"
            message={error?.message || "Failed to create tour"}
            type="error"
          />
        </UIView>
      )}

      {/* Submit button */}
      <UIView
        padding="large"
        color="slateDark"
        style={{ paddingBottom: insets.bottom + theme.spacing.large }}
      >
        {spots.length === 0 && (
          <UIView paddingBottom="small">
            <UIText color="slateLight" size="small" align="center">
              Add at least one spot to create your tour
            </UIText>
          </UIView>
        )}
        <UIButton
          variant="outlined"
          extended
          isLoading={isPending}
          disabled={spots.length === 0}
          onPress={handleSubmit(onSubmit)}
        >
          Create Tour
        </UIButton>
      </UIView>

      {/* Spot form modal */}
      <SpotFormModal
        visible={spotModalVisible}
        onClose={() => setSpotModalVisible(false)}
        onSubmit={handleAddSpot}
        coordinates={selectedCoordinates}
      />
    </UIView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
