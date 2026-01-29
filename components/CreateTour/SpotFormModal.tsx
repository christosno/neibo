import { Modal, Pressable, StyleSheet, ScrollView } from "react-native";
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
import { useEffect } from "react";

const spotFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  reach_radius: z.number().optional(),
  imageUrl: z.string().optional(),
});

type SpotFormValues = z.infer<typeof spotFormSchema>;

type SpotFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    reach_radius?: number;
    imageUrls?: string[];
  }) => void;
  coordinates: { latitude: number; longitude: number } | null;
};

export function SpotFormModal({
  visible,
  onClose,
  onSubmit,
  coordinates,
}: SpotFormModalProps) {
  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const handleFormSubmit = (data: SpotFormValues) => {
    if (!coordinates) return;

    onSubmit({
      title: data.title,
      description: data.description,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      reach_radius: data.reach_radius,
      imageUrls: data.imageUrl ? [data.imageUrl] : undefined,
    });
    // Don't close here - parent component handles closing and state updates
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <UIView gap="medium" padding="large" paddingBottom="xxLarge">
              <UIView row mainAxis="space-between" crossAxis="center">
                <UIText size="large" color="yellow" align="left" expanded>
                  Add Spot
                </UIText>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </UIView>

              {coordinates && (
                <UIView color="slate" padding="medium" borderRadius="medium">
                  <UIText size="small" color="slateLight" align="left">
                    Location: {coordinates.latitude.toFixed(6)},{" "}
                    {coordinates.longitude.toFixed(6)}
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.slateDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 10,
  },
});
