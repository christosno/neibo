import { Button } from "react-native";
import { useAuth } from "@/authentication/useAuth";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { UITextButton } from "@/ui-kit/buttons/UITextButton";
import { Link } from "expo-router";

export default function Profile() {
  const { logout, isAuthenticated } = useAuth();
  return (
    <UIView
      color="slateDark"
      paddingTop="xxLarge"
      style={{ height: "100%" }}
      mainAxis="flex-start"
      crossAxis="center"
    >
      <Link href="/(profile)/createTour" asChild><UITextButton onPress={() => {}}>Create a tour</UITextButton></Link>
      <Button title="Logout" onPress={logout} />
    </UIView>
  );
}
