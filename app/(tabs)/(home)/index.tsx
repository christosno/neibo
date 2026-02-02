import {
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { Notification } from "@/ui-kit/feedback/Notification";
import { TripCard } from "@/components/TripCard";
import { theme } from "@/theme";
import { useGetTours } from "@/hooks/tours/useGetTours";
import type { Tour } from "@/services/tours/get-tours";

export default function Home() {
  const insets = useSafeAreaInsets();
  const {
    tours,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useGetTours();

  const handleTripPress = (tour: Tour) => {
    router.push(`/tourDetails/${tour.id}`);
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderHeader = () => (
    <UIView paddingHorizontal="large" paddingTop="large" paddingBottom="medium">
      <UIText size="large" align="left" color="yellow">
        Discover Tours
      </UIText>
    </UIView>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <UIView padding="large" mainAxis="center" crossAxis="center">
        <ActivityIndicator color={theme.colors.yellow} />
      </UIView>
    );
  };

  const renderEmptyList = () => (
    <UIView padding="large" mainAxis="center" crossAxis="center">
      <UIText color="slateLight" align="center">
        No tours available yet.
      </UIText>
      <UIVerticalSpacer height={theme.spacing.medium} />
      <UIText color="slateLight" size="small" align="center">
        Be the first to create one!
      </UIText>
    </UIView>
  );

  if (isLoading) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <UIDotsLoader />
        <UIVerticalSpacer height={theme.spacing.medium} />
        <UIText color="slateLight">Loading tours...</UIText>
      </UIView>
    );
  }

  if (isError) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message={error?.message || "Failed to load tours"}
          type="error"
        />
        <UIVerticalSpacer height={theme.spacing.large} />
        <UIButton variant="outlined" onPress={() => refetch()}>
          Try Again
        </UIButton>
      </UIView>
    );
  }

  return (
    <UIView expanded color="slateDark">
      <UIView
        paddingHorizontal="large"
        paddingTop="large"
        paddingBottom="medium"
      >
        <UIButton variant="outlined" onPress={() => router.push("/(aiTour)")}>
          Create a Tour with AI
        </UIButton>
      </UIView>

      <FlatList
        style={{ flex: 1 }}
        data={tours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UIView paddingHorizontal="large">
            <TripCard tour={item} onPress={() => handleTripPress(item)} />
          </UIView>
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + theme.spacing.xxLarge },
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor={theme.colors.yellow}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </UIView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
});
