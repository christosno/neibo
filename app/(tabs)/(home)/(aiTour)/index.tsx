import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { Notification } from "@/ui-kit/feedback/Notification";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { UISelect } from "@/ui-kit/inputs/UISelect";
import { UIText } from "@/ui-kit/typography/UIText";
import { Controller } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import { theme } from "@/theme";
import { useTourForm, TOUR_THEMES, TourFormData } from "../../../../hooks/generate-tour-with-ai/useTourForm";
import { useGenerateTourWithAi } from "@/hooks/generate-tour-with-ai/useGenerateTourWithAi";
import { router } from "expo-router";

export default function AiTour() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useTourForm();

  const { generateTour, error, isPending } = useGenerateTourWithAi();

  const onSubmit = async (formData: TourFormData) => {
    console.log("Form submitted:", formData);
    try {
      await generateTour(formData);
      reset();
      router.push("/aiTrip");
    } catch (error) {
      console.log("👉 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <UIView expanded color="slateDark">
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <UIView paddingHorizontal="large" paddingTop="large">
          <UIText size="large" align="left" color="yellow">
            Create Your Tour
          </UIText>
          <UIVerticalSpacer height={theme.spacing.large} />

          <UITextInput
            label="City *"
            control={control}
            name="city"
            placeholder="City"
            hasError={!!errors.city}
            errorMessage={errors.city?.message}
          />

          <UIVerticalSpacer height={theme.spacing.medium} />

          <UITextInput
            label="Neighborhood"
            control={control}
            name="neighborhood"
            placeholder="Neighborhood"
            hasError={!!errors.neighborhood}
            errorMessage={errors.neighborhood?.message}
          />

          <UIVerticalSpacer height={theme.spacing.medium} />

          <UITextInput
            label="Tour Duration"
            control={control}
            name="duration"
            keyboardType="numeric"
            placeholder={"Duration in minutes"}
            hasError={!!errors.duration}
            errorMessage={errors.duration?.message}
          />

          <UIVerticalSpacer height={theme.spacing.medium} />

          <Controller
            control={control}
            name="tourTheme"
            render={({ field: { onChange, value } }) => (
              <UISelect
                label="Tour Theme / Style *"
                placeholder="Tour Theme / Style *"
                value={value}
                onChange={onChange}
                options={TOUR_THEMES.map((theme) => ({
                  label: theme,
                  value: theme,
                }))}
                error={errors.tourTheme?.message}
              />
            )}
          />
          <UIVerticalSpacer height={theme.spacing.medium} />

          <UITextInput
            label="Start Location"
            control={control}
            name="startLocation"
            placeholder="Start Location (optional, e.g., Plaça de Catalunya)"
            hasError={!!errors.startLocation}
            errorMessage={errors.startLocation?.message}
          />

          <UIVerticalSpacer height={theme.spacing.medium} />

          <UITextInput
            label="Language"
            control={control}
            name="language"
            placeholder="Language (optional, e.g., English)"
            hasError={!!errors.language}
            errorMessage={errors.language?.message}
          />

          <UIVerticalSpacer height={theme.spacing.xLarge} />

          {error && (
            <>
              <Notification
                title="Error"
                message={error?.message || "An unexpected error occurred"}
                type="error"
              />
              <UIVerticalSpacer height={theme.spacing.xLarge} />
            </>
          )}

          {/* Submit Button */}
          <UIView.Animated linearTransition>
            <UIButton
              isLoading={isPending}
              variant="outlined"
              extended
              onPress={handleSubmit(onSubmit)}
            >
              Generate Tour
            </UIButton>
          </UIView.Animated>
          <UIVerticalSpacer height={theme.spacing.large} />
        </UIView>
      </KeyboardAwareScrollView>
    </UIView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
