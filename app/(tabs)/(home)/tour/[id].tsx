import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIDotsLoader } from "@/ui-kit/feedback/UIDotsLoader";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { Notification } from "@/ui-kit/feedback/Notification";
import { useRequestLocationPermissions } from "@/hooks/useRequestLocationPermissions";
import { useGetWalkById } from "@/hooks/walks/useGetWalkById";
import { useWalkSpots } from "@/hooks/maps/useWalkSpots";
import { WalkGoogleMapsComponent } from "@/components/WalkGoogleMapsComponent";
import { WalkAppleMapsComponent } from "@/components/WalkAppleMapsComponent";
import { theme } from "@/theme";

export default function WalkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { walk, isLoading, isError, error, refetch } = useGetWalkById(id);
  const spots = useWalkSpots(walk?.spots);

  useRequestLocationPermissions();

  if (isLoading) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <UIDotsLoader />
        <UIVerticalSpacer height={theme.spacing.medium} />
        <UIText color="slateLight">Loading tour...</UIText>
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

  if (!walk) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message="Tour not found"
          type="error"
        />
      </UIView>
    );
  }

  return Platform.OS === "android" ? (
    <WalkGoogleMapsComponent spots={spots} />
  ) : (
    <WalkAppleMapsComponent spots={spots} />
  );
}
