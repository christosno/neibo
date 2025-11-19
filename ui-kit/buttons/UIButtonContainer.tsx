import React, { ReactNode, useState } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { UIView } from "../layout/UIView";
import { UIThemeColor } from "@/theme";

type Variant = "filled" | "outlined";

type Props = {
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  stretched?: boolean;
  onPress: () => void;
  extended?: boolean;
};

export function UIButtonContainer({
  variant = "filled",
  disabled = false,
  style,
  stretched = false,
  children,
  onPress,
  extended = false,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);

  const bgColor: UIThemeColor = (() => {
    if (disabled) return "greyDark";
    if (isPressed) return variant === "outlined" ? "yellow" : "yellow";
    return variant === "outlined" ? "greyDark" : "yellow";
  })();

  return (
    <UIView.Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      preventDoubleTap
      pressAnimation={variant === "outlined" ? "fade" : "none"}
      disabled={disabled}
      color={bgColor}
      border={variant === "outlined" ? "yellow.small" : "white.small"}
      height={45}
      borderRadius="xxlarge"
      crossAxis="center"
      style={[
        {
          transitionDuration: 100,
          transitionProperty: "backgroundColor",
        },
        getSizeStyles(stretched, extended),
        style,
      ]}
    >
      {children}
    </UIView.Pressable>
  );
}

const getSizeStyles = (stretched: boolean, extended: boolean) => {
  if (stretched) return styles.stretched;
  if (extended) return styles.extended;

  return styles.neitherStretchedNorExtended;
};

const styles = StyleSheet.create({
  extended: {
    paddingHorizontal: 39,
  },
  neitherStretchedNorExtended: {
    paddingHorizontal: 20,
  },
  stretched: {
    width: "100%",
    alignSelf: "stretch",
    flexShrink: 1,
  },
});
