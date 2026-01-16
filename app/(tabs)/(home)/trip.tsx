import { Platform } from "react-native";
import { useAiTourStore } from "@/hooks/useAiTourStore";
import { UIView } from "@/ui-kit/layout/UIView";
import { Notification } from "@/ui-kit/feedback/Notification";
import { useRequestLocationPermissions } from "@/hooks/useRequestLocationPermissions";
import { GoogleMapsComponent } from "@/components/GoogleMapsComponent";
import { AppleMapsComponent } from "@/components/AppleMapsComponent";

export default function Trip() {
  const tourData = useAiTourStore((state) => {
    return state.tourData;
  });
  useRequestLocationPermissions();

  if (!tourData) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message="Not able to generate tour"
          type="error"
        />
      </UIView>
    );
  }

  return Platform.OS === "android" ? (
    <GoogleMapsComponent />
  ) : (
    <AppleMapsComponent />
  );
}
