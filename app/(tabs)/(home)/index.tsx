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
import { useTourForm, TOUR_THEMES, TourFormData } from "./useTourForm";
import { useGenerateTourWithAi } from "@/hooks/generate-tour-with-ai/useGenerateTourWithAi";
import { router } from "expo-router";

export default function Home() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useTourForm();

  const { generateTour, error, isPending } = useGenerateTourWithAi();

  const onSubmit = async (formData: TourFormData) => {
    console.log("Form submitted:", formData);
    try {
      await generateTour(formData);
      router.push("/trip");
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

          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            City *
          </UIText>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <UITextInput
                placeholder="City"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.city && (
            <UIText
              size="small"
              style={{ paddingLeft: theme.spacing.small }}
              align="left"
              color="error"
            >
              {errors.city.message}
            </UIText>
          )}
          <UIVerticalSpacer height={theme.spacing.medium} />

          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            Neighborhood
          </UIText>
          <Controller
            control={control}
            name="neighborhood"
            render={({ field: { onChange, onBlur, value } }) => (
              <UITextInput
                placeholder="Neighborhood"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <UIVerticalSpacer height={theme.spacing.medium} />

          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            Tour Duration
          </UIText>
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, onBlur, value } }) => (
              <UITextInput
                placeholder={"Duration in minutes"}
                value={value?.toString() || ""}
                onChangeText={(text) => {
                  const numValue = Number(text);
                  onChange(isNaN(numValue) ? 0 : numValue);
                }}
                onBlur={onBlur}
              />
            )}
          />
          {errors.duration && (
            <UIText
              size="small"
              style={{ paddingLeft: theme.spacing.small }}
              align="left"
              color="error"
            >
              {errors.duration.message}
            </UIText>
          )}
          <UIVerticalSpacer height={theme.spacing.medium} />

          {/* Tour Theme */}
          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            Tour Theme / Style *
          </UIText>
          <Controller
            control={control}
            name="tourTheme"
            render={({ field: { onChange, value } }) => (
              <UISelect
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

          {/* Start Location */}
          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            Start Location
          </UIText>
          <Controller
            control={control}
            name="startLocation"
            render={({ field: { onChange, onBlur, value } }) => (
              <UITextInput
                placeholder="Start Location (optional, e.g., Plaça de Catalunya)"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <UIVerticalSpacer height={theme.spacing.medium} />

          {/* Language */}
          <UIText
            size="small"
            align="left"
            color="yellow"
            style={{ marginBottom: theme.spacing.tiny }}
          >
            Language
          </UIText>
          <Controller
            control={control}
            name="language"
            render={({ field: { onChange, value, onBlur } }) => (
              <UITextInput
                placeholder="Language (optional, e.g., English)"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
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
          <UIButton
            isLoading={isPending}
            variant="outlined"
            extended
            onPress={handleSubmit(onSubmit)}
          >
            Generate Tour
          </UIButton>
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
