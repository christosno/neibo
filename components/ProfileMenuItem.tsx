import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type ProfileMenuItemProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
};

export function ProfileMenuItem({ icon, label, onPress }: ProfileMenuItemProps) {
  return (
    <UIView.Pressable onPress={onPress}>
      <UIView
        row
        color="slate"
        borderRadius="medium"
        padding="medium"
        crossAxis="center"
        mainAxis="space-between"
      >
        <UIView row crossAxis="center" gap="medium">
          <Ionicons name={icon} size={24} color={theme.colors.yellow} />
          <UIText size="medium" color="slateLight">
            {label}
          </UIText>
        </UIView>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.slateLight}
        />
      </UIView>
    </UIView.Pressable>
  );
}
