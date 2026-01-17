import { UIView } from "../layout/UIView";
import { UIText } from "../typography/UIText";
import { ReactNode } from "react";
import * as Haptics from "expo-haptics";

export function UITextButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <UIView.Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
    >
      <UIText color="yellow">{children}</UIText>
    </UIView.Pressable>
  );
}
