import { Modal, Pressable, StyleSheet } from "react-native";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { Ionicons } from "@expo/vector-icons";
import { StarRatingInput } from "./StarRatingInput";
import { useReviewForm, type ReviewFormData } from "@/hooks/reviews/useReviewForm";
import { useCreateReview } from "@/hooks/reviews/useCreateReview";
import { useEffect } from "react";
import { theme } from "@/theme";

type CreateReviewModalProps = {
  walkId: string;
  visible: boolean;
  onClose: () => void;
};

export function CreateReviewModal({
  walkId,
  visible,
  onClose,
}: CreateReviewModalProps) {
  const form = useReviewForm();
  const { createReview, isPending, isSuccess, reset } = useCreateReview(walkId);

  const stars = form.watch("stars");
  const starsError = form.formState.errors.stars;

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      reset();
      onClose();
    }
  }, [isSuccess, form, reset, onClose]);

  const handleSubmit = async (data: ReviewFormData) => {
    try {
      await createReview({
        stars: data.stars,
        textReview: data.textReview || undefined,
      });
    } catch {
      // Error is logged in the hook
    }
  };

  const handleClose = () => {
    form.reset();
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={handleClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <UIView gap="medium" padding="large">
            <UIView row mainAxis="space-between" crossAxis="center">
              <UIText size="large" color="yellow" align="left" expanded>
                Write a Review
              </UIText>
              <Pressable onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.colors.white} />
              </Pressable>
            </UIView>

            <UIView gap="small">
              <UIText size="medium" color="slateLight" align="left">
                Rating
              </UIText>
              <StarRatingInput
                value={stars}
                onChange={(rating) => {
                  form.setValue("stars", rating, { shouldValidate: true });
                }}
              />
              {starsError && (
                <UIText size="small" color="error" align="left">
                  {starsError.message}
                </UIText>
              )}
            </UIView>

            <UITextInput
              control={form.control}
              name="textReview"
              label="Review (optional)"
              labelColor="slateLight"
              placeholder="Share your experience..."
              backroundColor="white"
              placeholderTextColor="gray"
              borderColor="yellow"
              multiline
              height={100}
            />

            <UIButton
              variant="filled"
              onPress={form.handleSubmit(handleSubmit)}
              isLoading={isPending}
              disabled={isPending}
            >
              Submit Review
            </UIButton>
          </UIView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.slate,
    borderRadius: 16,
    margin: 20,
    width: "90%",
    maxHeight: "70%",
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
