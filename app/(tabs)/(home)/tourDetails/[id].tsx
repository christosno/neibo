import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { Notification } from "@/ui-kit/feedback/Notification";
import { theme } from "@/theme";

import { useGetTourById } from "@/hooks/tours/useGetTourById";
import { useGetReviews } from "@/hooks/reviews/useGetReviews";
import { useAuth } from "@/authentication/useAuth";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { CreateReviewModal } from "@/components/reviews/CreateReviewModal";

export default function TourDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const { tour, isLoading, isError, error, refetch } = useGetTourById(id);
  const {
    reviews,
    totalReviews,
    isLoading: isLoadingReviews,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetReviews(id);

  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const formatDuration = (minutes?: number | string) => {
    if (minutes === undefined || minutes === null) return null;
    const mins = typeof minutes === "string" ? parseFloat(minutes) : minutes;
    if (isNaN(mins) || mins <= 0) return null;
    if (mins < 60) return `${Math.round(mins)} min`;
    const hours = Math.floor(mins / 60);
    const remainder = Math.round(mins % 60);
    return remainder > 0 ? `${hours}h ${remainder}min` : `${hours}h`;
  };

  const formatDistance = (km?: number | string) => {
    if (km === undefined || km === null) return null;
    const distance = typeof km === "string" ? parseFloat(km) : km;
    if (isNaN(distance) || distance <= 0) return null;
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsReviewModalVisible(true);
  };

  const handleStartTour = () => {
    router.push(`/tour/${id}`);
  };

  if (isLoading) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <UIDotsLoader />
        <UIVerticalSpacer height={theme.spacing.medium} />
        <UIText color="slateLight">Loading tour details...</UIText>
      </UIView>
    );
  }

  if (isError) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message={error?.message || "Failed to load tour"}
          type="error"
        />
        <UIVerticalSpacer height={theme.spacing.large} />
        <UIButton variant="outlined" onPress={() => refetch()}>
          Try Again
        </UIButton>
      </UIView>
    );
  }

  if (!tour) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification title="Error" message="Tour not found" type="error" />
      </UIView>
    );
  }

  const duration = formatDuration(tour.duration_estimate);
  const distance = formatDistance(tour.distance_estimate);
  const spotsCount = tour.spots?.length ?? 0;

  return (
    <UIView expanded color="slateDark">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.xxLarge }}
        showsVerticalScrollIndicator={false}
      >
        {tour.coverImageUrl && tour.coverImageUrl.length > 0 ? (
          <Image
            source={{ uri: tour.coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <UIView style={styles.placeholderImage} color="slate">
            <Ionicons
              name="map-outline"
              size={60}
              color={theme.colors.slateLight}
            />
          </UIView>
        )}

        <UIView padding="large" gap="medium">
          <UIView row crossAxis="center" gap="small">
            <UIText size="large" color="yellow" align="left" expanded>
              {tour.name}
            </UIText>
          </UIView>

          <UIView row crossAxis="center" gap="small">
            {tour.author?.profilePicture ? (
              <Image
                source={{ uri: tour.author.profilePicture }}
                style={styles.authorAvatar}
              />
            ) : (
              <UIView
                color="slate"
                size={24}
                circle
                mainAxis="center"
                crossAxis="center"
              >
                <Ionicons
                  name="person"
                  size={14}
                  color={theme.colors.slateLight}
                />
              </UIView>
            )}
            <UIText size="small" color="slateLight" align="left">
              by {tour.author?.username ?? "Unknown"}
            </UIText>
          </UIView>

          {tour.avgStars !== null && tour.avgStars !== undefined && (
            <UIView row crossAxis="center" gap="tiny">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(tour.avgStars!) ? "star" : "star-outline"}
                  size={18}
                  color={
                    star <= Math.round(tour.avgStars!)
                      ? theme.colors.yellow
                      : theme.colors.slateLight
                  }
                />
              ))}
              <UIText size="small" color="slateLight" style={styles.ratingText}>
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </UIText>
            </UIView>
          )}

          <UIView row gap="medium" style={styles.metaContainer}>
            {duration && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {duration}
                </UIText>
              </UIView>
            )}

            {distance && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name="walk-outline"
                  size={16}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {distance}
                </UIText>
              </UIView>
            )}

            {spotsCount > 0 && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {spotsCount} {spotsCount === 1 ? "spot" : "spots"}
                </UIText>
              </UIView>
            )}
          </UIView>

          {tour.walkTags && tour.walkTags.length > 0 && (
            <UIView row gap="small" style={styles.tagsContainer}>
              {tour.walkTags.map((tag, index) => (
                <UIView
                  key={index}
                  color="slate"
                  borderRadius="xlarge"
                  paddingHorizontal="medium"
                  paddingVertical="small"
                >
                  <UIText size="small" color="slateLight">
                    {tag}
                  </UIText>
                </UIView>
              ))}
            </UIView>
          )}

          {tour.description && (
            <UIText size="medium" color="slateLight" align="left">
              {tour.description}
            </UIText>
          )}

          <UIButton variant="filled" onPress={handleStartTour}>
            Start Tour
          </UIButton>

          <UIView
            row
            mainAxis="space-between"
            crossAxis="center"
            marginTop="medium"
          >
            <UIText size="medium" color="yellow" align="left">
              Reviews ({totalReviews})
            </UIText>
            <UIView.Pressable onPress={handleWriteReview}>
              <UIText size="small" color="yellow">
                Write Review
              </UIText>
            </UIView.Pressable>
          </UIView>

          {isLoadingReviews ? (
            <UIView padding="large" mainAxis="center" crossAxis="center">
              <ActivityIndicator color={theme.colors.yellow} />
            </UIView>
          ) : reviews.length === 0 ? (
            <UIView padding="medium">
              <UIText size="small" color="slateLight" align="center">
                No reviews yet. Be the first to review this tour!
              </UIText>
            </UIView>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {hasNextPage && (
                <UIView.Pressable
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  padding="medium"
                  mainAxis="center"
                  crossAxis="center"
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator color={theme.colors.yellow} />
                  ) : (
                    <UIText size="small" color="yellow">
                      Load more reviews
                    </UIText>
                  )}
                </UIView.Pressable>
              )}
            </>
          )}
        </UIView>
      </ScrollView>

      <CreateReviewModal
        walkId={id!}
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
      />
    </UIView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 250,
  },
  placeholderImage: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
  },
  metaContainer: {
    flexWrap: "wrap",
  },
  tagsContainer: {
    flexWrap: "wrap",
  },
});
