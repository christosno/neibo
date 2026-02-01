import { useAuth } from "@/authentication/useAuth";
import { ProfileMenuItem } from "@/components/ProfileMenuItem";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { router } from "expo-router";

export default function Profile() {
  const { logout, isAuthenticated, user } = useAuth();
  const setIsGuest = useAuth((state) => state.setIsGuest);

  const handleLogin = () => {
    setIsGuest(false);
  };

  return (
    <UIView
      color="slateDark"
      paddingTop="large"
      paddingHorizontal="medium"
      style={{ height: "100%" }}
      mainAxis="flex-start"
      crossAxis="stretch"
      gap="large"
    >
      <UIView crossAxis="center" gap="small" paddingVertical="medium">
        <UIText size="large" color="slateLight">
          Hello {isAuthenticated && user?.username ? user.username : "Guest"}
        </UIText>
      </UIView>

      <UIView gap="small">
        {isAuthenticated && (
          <>
            <ProfileMenuItem
              icon="add-circle-outline"
              label="Create a tour"
              onPress={() => router.push("/(profile)/createTour")}
            />
            <ProfileMenuItem
              icon="walk-outline"
              label="See all my tours"
              onPress={() => router.push("/(profile)/myTours")}
            />
          </>
        )}

        <UIVerticalSpacer height={25} />

        {isAuthenticated ? (
          <ProfileMenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={logout}
          />
        ) : (
          <ProfileMenuItem
            icon="log-in-outline"
            label="Login"
            onPress={handleLogin}
          />
        )}
      </UIView>
    </UIView>
  );
}
