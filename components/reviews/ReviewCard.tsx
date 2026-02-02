import { StyleSheet, Image } from "react-native";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";
import type { Review } from "@/services/reviews/get-reviews";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <UIView
      color="slate"
      borderRadius="medium"
      padding="medium"
      gap="small"
      style={styles.card}
    >
      <UIView row crossAxis="center" gap="small">
        {review.user.profilePicture ? (
          <Image
            source={{ uri: review.user.profilePicture }}
            style={styles.avatar}
          />
        ) : (
          <UIView
            color="slateDark"
            size={36}
            circle
            mainAxis="center"
            crossAxis="center"
          >
            <Ionicons
              name="person"
              size={18}
              color={theme.colors.slateLight}
            />
          </UIView>
        )}
        <UIView expanded>
          <UIText size="medium" color="white" align="left">
            {review.user.username}
          </UIText>
          <UIText size="small" color="slateLight" align="left">
            {formatDate(review.createdAt)}
          </UIText>
        </UIView>
      </UIView>

      <UIView row gap="tiny">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= review.stars ? "star" : "star-outline"}
            size={16}
            color={
              star <= review.stars
                ? theme.colors.yellow
                : theme.colors.slateLight
            }
          />
        ))}
      </UIView>

      {review.textReview && (
        <UIText size="small" color="slateLight" align="left">
          {review.textReview}
        </UIText>
      )}
    </UIView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.medium,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
