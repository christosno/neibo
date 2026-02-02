import { StyleSheet, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { UIView } from "@/ui-kit/layout/UIView";
import { SafeAreaUIView } from "@/ui-kit/layout/SafeAreaUIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { UIMultiSelect } from "@/ui-kit/inputs/UIMultiSelect";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { theme } from "@/theme";
import {
  TOUR_TAGS,
  type CreateTourFormData,
} from "@/hooks/create-tour/useCreateTourForm";
import { Stepper } from "./Stepper";
import { WizardStep } from "./types";

type InfoStepProps = {
  control: Control<CreateTourFormData>;
  errors: FieldErrors<CreateTourFormData>;
  currentStep: WizardStep;
  invalidSteps: WizardStep[];
  onStepPress: (step: WizardStep) => void;
  onNext: () => void;
};

export function InfoStep({
  control,
  errors,
  currentStep,
  invalidSteps,
  onStepPress,
  onNext,
}: InfoStepProps) {
  return (
    <SafeAreaUIView edges={["bottom"]} expanded color="slateDark">
      <Stepper
        currentStep={currentStep}
        onStepPress={onStepPress}
        invalidSteps={invalidSteps}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <UIView paddingHorizontal="large" paddingTop="medium">
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
            label="Description *"
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

          <UIButton variant="outlined" extended onPress={onNext}>
            Next: Add Spots
          </UIButton>

          <UIVerticalSpacer height={theme.spacing.xLarge + 34} />
        </UIView>
      </KeyboardAwareScrollView>
    </SafeAreaUIView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
