import { StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { Notification } from "@/ui-kit/feedback/Notification";
import { theme } from "@/theme";
import { type SpotFormData, type CreateTourFormData } from "@/hooks/create-tour/useCreateTourForm";
import { Stepper } from "./Stepper";
import { WizardStep } from "./types";

type SummaryStepProps = {
  formValues: CreateTourFormData;
  spots: SpotFormData[];
  currentStep: WizardStep;
  invalidSteps: WizardStep[];
  isPending: boolean;
  error: Error | null;
  onStepPress: (step: WizardStep) => void;
  onSubmit: () => void;
};

export function SummaryStep({
  formValues,
  spots,
  currentStep,
  invalidSteps,
  isPending,
  error,
  onStepPress,
  onSubmit,
}: SummaryStepProps) {
  const insets = useSafeAreaInsets();

  return (
    <UIView expanded color="slateDark">
      <Stepper
        currentStep={currentStep}
        onStepPress={onStepPress}
        invalidSteps={invalidSteps}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + theme.spacing.xxLarge },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UIView paddingHorizontal="large" paddingTop="medium" gap="large">
          {/* Tour Name */}
          <UIView color="slate" padding="medium" borderRadius="medium">
            <UIText size="small" color="slateLight" align="left">
              Tour Name
            </UIText>
            <UIVerticalSpacer height={theme.spacing.tiny} />
            <UIText size="medium" color="yellow" align="left">
              {formValues.name}
            </UIText>
          </UIView>

          {/* Description */}
          <UIView color="slate" padding="medium" borderRadius="medium">
            <UIText size="small" color="slateLight" align="left">
              Description
            </UIText>
            <UIVerticalSpacer height={theme.spacing.tiny} />
            <UIText size="medium" color="white" align="left">
              {formValues.description}
            </UIText>
          </UIView>

          {/* Details Row */}
          <UIView row gap="medium">
            {formValues.duration_estimate && (
              <UIView
                expanded
                color="slate"
                padding="medium"
                borderRadius="medium"
              >
                <UIText size="small" color="slateLight" align="left">
                  Duration
                </UIText>
                <UIVerticalSpacer height={theme.spacing.tiny} />
                <UIView row crossAxis="center" gap="tiny">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.colors.yellow}
                  />
                  <UIText size="medium" color="yellow" align="left">
                    {formValues.duration_estimate} min
                  </UIText>
                </UIView>
              </UIView>
            )}
            {formValues.distance_estimate && (
              <UIView
                expanded
                color="slate"
                padding="medium"
                borderRadius="medium"
              >
                <UIText size="small" color="slateLight" align="left">
                  Distance
                </UIText>
                <UIVerticalSpacer height={theme.spacing.tiny} />
                <UIView row crossAxis="center" gap="tiny">
                  <Ionicons
                    name="walk-outline"
                    size={16}
                    color={theme.colors.yellow}
                  />
                  <UIText size="medium" color="yellow" align="left">
                    {formValues.distance_estimate} km
                  </UIText>
                </UIView>
              </UIView>
            )}
          </UIView>

          {/* Visibility */}
          <UIView color="slate" padding="medium" borderRadius="medium">
            <UIText size="small" color="slateLight" align="left">
              Visibility
            </UIText>
            <UIVerticalSpacer height={theme.spacing.tiny} />
            <UIView row crossAxis="center" gap="tiny">
              <Ionicons
                name={
                  formValues.isPublic ? "globe-outline" : "lock-closed-outline"
                }
                size={16}
                color={theme.colors.yellow}
              />
              <UIText size="medium" color="yellow" align="left">
                {formValues.isPublic ? "Public" : "Private"}
              </UIText>
            </UIView>
          </UIView>

          {/* Tags */}
          {formValues.tagIds && formValues.tagIds.length > 0 && (
            <UIView color="slate" padding="medium" borderRadius="medium">
              <UIText size="small" color="slateLight" align="left">
                Tags
              </UIText>
              <UIVerticalSpacer height={theme.spacing.small} />
              <UIView row gap="small" style={styles.tagsContainer}>
                {formValues.tagIds.map((tag) => (
                  <UIView
                    key={tag}
                    color="slateDark"
                    paddingHorizontal="medium"
                    paddingVertical="small"
                    borderRadius="medium"
                  >
                    <UIText size="small" color="yellow">
                      {tag}
                    </UIText>
                  </UIView>
                ))}
              </UIView>
            </UIView>
          )}

          {/* Spots */}
          <UIView>
            <UIText size="medium" color="yellow" align="left">
              Spots ({spots.length})
            </UIText>
            <UIVerticalSpacer height={theme.spacing.medium} />
            {spots.map((spot, index) => (
              <UIView
                key={`summary-spot-${index}`}
                color="slate"
                padding="medium"
                borderRadius="medium"
                style={styles.summarySpotCard}
              >
                <UIView row crossAxis="flex-start" gap="medium">
                  <UIView
                    color="slateDark"
                    style={styles.spotNumber}
                    mainAxis="center"
                    crossAxis="center"
                  >
                    <UIText size="small" color="yellow">
                      {index + 1}
                    </UIText>
                  </UIView>
                  <UIView expanded>
                    <UIText size="medium" color="yellow" align="left">
                      {spot.title}
                    </UIText>
                    {spot.description && (
                      <>
                        <UIVerticalSpacer height={theme.spacing.tiny} />
                        <UIText
                          size="small"
                          color="slateLight"
                          align="left"
                          numberOfLines={2}
                        >
                          {spot.description}
                        </UIText>
                      </>
                    )}
                  </UIView>
                </UIView>
              </UIView>
            ))}
          </UIView>
        </UIView>
      </ScrollView>

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
        <UIButton
          variant="outlined"
          extended
          isLoading={isPending}
          onPress={onSubmit}
        >
          Create Tour
        </UIButton>
      </UIView>
    </UIView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  tagsContainer: {
    flexWrap: "wrap",
  },
  summarySpotCard: {
    marginBottom: theme.spacing.small,
  },
  spotNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
