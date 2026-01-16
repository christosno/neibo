import { theme } from "@/theme";
import { UIView } from "../layout/UIView";
import { UIText } from "../typography/UIText";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";

export function UITextButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <UIView.Pressable onPress={onPress}>
      <UIText color="yellow">{children}</UIText>
    </UIView.Pressable>
  );
}
