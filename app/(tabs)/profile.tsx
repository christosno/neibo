import { Button } from "react-native";
import { useAuth } from "@/authentication/useAuth";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";

export default function Profile() {
  const { logout, user } = useAuth();

  return (
    <UIView
      color="slateDark"
      style={{ height: "100%" }}
      mainAxis="center"
      crossAxis="center"
    >
      <UIText color="slateLight">Profile</UIText>
      <UIText color="slateLight">{user?.email}</UIText>
      <UIText color="slateLight">{user?.username}</UIText>
      <UIText color="slateLight">{user?.firstName}</UIText>
      <UIText color="slateLight">{user?.lastName}</UIText>
      <UIText color="slateLight">{user?.createdAt}</UIText>
      <Button title="Logout" onPress={logout} />
    </UIView>
  );
}
