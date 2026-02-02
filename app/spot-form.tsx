import { StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSpotFormStore } from "@/hooks/useSpotFormStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const spotFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  reach_radius: z.number().optional(),
  imageUrl: z.string().optional(),
});

type SpotFormValues = z.infer<typeof spotFormSchema>;

export default function SpotFormScreen() {
  const insets = useSafeAreaInsets();
  const { pendingCoordinates, setResult } = useSpotFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SpotFormValues>({
    defaultValues: {
      title: "",
      description: "",
      reach_radius: undefined,
      imageUrl: "",
    },
    resolver: zodResolver(spotFormSchema),
    mode: "onTouched",
  });

  const handleClose = () => {
    router.back();
  };

  const handleFormSubmit = (data: SpotFormValues) => {
    if (!pendingCoordinates) return;

    setResult({
      title: data.title,
      description: data.description,
      latitude: pendingCoordinates.latitude,
      longitude: pendingCoordinates.longitude,
      reach_radius: data.reach_radius,
      imageUrls: data.imageUrl ? [data.imageUrl] : undefined,
    });

    router.back();
  };

  return (
    <UIView expanded color="slateDark">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + theme.spacing.large },
        ]}
      >
        <UIView gap="medium" padding="large">
          <UIView row mainAxis="space-between" crossAxis="center">
            <UIText size="large" color="yellow" align="left" expanded>
              Add Spot
            </UIText>
            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </UIView>

          {pendingCoordinates && (
            <UIView color="slate" padding="medium" borderRadius="medium">
              <UIText size="small" color="slateLight" align="left">
                Location: {pendingCoordinates.latitude.toFixed(6)},{" "}
                {pendingCoordinates.longitude.toFixed(6)}
              </UIText>
            </UIView>
          )}

          <UIVerticalSpacer height={theme.spacing.small} />

          <UITextInput
            label="Title *"
            control={control}
            name="title"
            placeholder="Spot title"
            hasError={!!errors.title}
            errorMessage={errors.title?.message}
          />

          <UIVerticalSpacer height={theme.spacing.small} />

          <UITextInput
            label="Description *"
            control={control}
            name="description"
            placeholder="Describe this spot"
            multiline
            numberOfLines={30}
            height={150}
            hasError={!!errors.description}
            errorMessage={errors.description?.message}
          />

          <UIVerticalSpacer height={theme.spacing.small} />

          <UITextInput
            label="Reach Radius (meters)"
            control={control}
            name="reach_radius"
            placeholder="40"
            keyboardType="numeric"
          />

          <UIVerticalSpacer height={theme.spacing.small} />

          <UITextInput
            label="Image URL"
            control={control}
            name="imageUrl"
            placeholder="https://example.com/image.jpg (optional)"
            keyboardType="url"
          />

          <UIVerticalSpacer height={theme.spacing.large} />

          <UIButton
            variant="outlined"
            extended
            onPress={handleSubmit(handleFormSubmit)}
          >
            Add Spot
          </UIButton>
        </UIView>
      </ScrollView>
    </UIView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});
