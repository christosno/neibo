import { ActivityIndicator, FlatList } from "react-native";
import { useAuth } from "@/authentication/useAuth";
import { UserTour } from "@/services/tours/get-user-tours";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetUserTours } from "@/hooks/tours/useGetUserTours";

function TourCard({ tour }: { tour: UserTour }) {
  const spotsCount = tour.spots.length;

  return (
    <UIView.Pressable
      color="slate"
      padding="medium"
      borderRadius="medium"
      gap="small"
      onPress={() => router.push(`/(home)/tour/${tour.id}`)}
    >
      <UIView row mainAxis="space-between" crossAxis="center">
        <UIText size="medium" color="slateLight">
          {tour.name}
        </UIText>
        {tour.isPublic ? (
          <Ionicons
            name="globe-outline"
            size={18}
            color={theme.colors.slateLight}
          />
        ) : (
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={theme.colors.slateLight}
          />
        )}
      </UIView>

      <UIText size="small" color="slateLight" numberOfLines={2}>
        {tour.description}
      </UIText>

      <UIView row gap="medium">
        <UIView row gap="tiny" crossAxis="center">
          <Ionicons
            name="location-outline"
            size={14}
            color={theme.colors.slateLight}
          />
          <UIText size="small" color="slateLight">
            {spotsCount} {spotsCount === 1 ? "spot" : "spots"}
          </UIText>
        </UIView>

        {tour.distance_estimate && (
          <UIView row gap="tiny" crossAxis="center">
            <Ionicons
              name="walk-outline"
              size={14}
              color={theme.colors.slateLight}
            />
            <UIText size="small" color="slateLight">
              {parseFloat(tour.distance_estimate).toFixed(1)} km
            </UIText>
          </UIView>
        )}
      </UIView>
    </UIView.Pressable>
  );
}

function EmptyState() {
  return (
    <UIView expanded mainAxis="center" crossAxis="center" gap="medium">
      <Ionicons name="map-outline" size={64} color={theme.colors.slateLight} />
      <UIText size="medium" color="slateLight">
        You haven&apos;t created any tours yet
      </UIText>
      <UIView.Pressable
        color="green"
        padding="medium"
        borderRadius="medium"
        onPress={() => router.push("/(profile)/createTour")}
      >
        <UIText size="medium" color="white">
          Create your first tour
        </UIText>
      </UIView.Pressable>
    </UIView>
  );
}

export default function MyTours() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const { tours, isLoading, isError, refetch } =
    useGetUserTours(isAuthenticated);

  if (isLoading) {
    return (
      <UIView color="slateDark" expanded mainAxis="center" crossAxis="center">
        <ActivityIndicator size="large" color={theme.colors.greenLight} />
      </UIView>
    );
  }

  if (isError) {
    return (
      <UIView
        color="slateDark"
        expanded
        mainAxis="center"
        crossAxis="center"
        gap="medium"
      >
        <UIText size="medium" color="slateLight">
          Failed to load tours
        </UIText>
        <UIView.Pressable
          color="green"
          padding="medium"
          borderRadius="medium"
          onPress={() => refetch()}
        >
          <UIText size="medium" color="white">
            Try again
          </UIText>
        </UIView.Pressable>
      </UIView>
    );
  }

  if (tours.length === 0) {
    return (
      <UIView color="slateDark" expanded>
        <EmptyState />
      </UIView>
    );
  }

  return (
    <UIView color="slateDark" expanded>
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TourCard tour={item} />}
        contentContainerStyle={{
          padding: theme.spacing.medium,
          gap: theme.spacing.small,
        }}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </UIView>
  );
}
