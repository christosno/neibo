import { UIView } from "@/ui-kit/layout/UIView";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { UIThemeColor } from "@/theme";

import { UIButtonContainer } from "./UIButtonContainer";
import { UIDotsLoader } from "../feedback/UIDotsLoader";
import { UIText } from "../typography/UIText";

type Variant = "filled" | "outlined";

type Props = {
  variant?: Variant;
  disabled?: boolean;
  stretched?: boolean;
  style?: StyleProp<ViewStyle>;
  children: string | number;
  onPress: () => void;
  extended?: boolean;
  isLoading?: boolean;
};

export function UIButton(props: Props) {
  const {
    variant = "filled",
    disabled = false,
    stretched = false,
    style,
    children,
    onPress,
    extended = false,
    isLoading = false,
  } = props;

  return (
    <UIButtonContainer
      variant={variant}
      onPress={onPress}
      style={style}
      stretched={stretched}
      disabled={disabled || isLoading}
      extended={extended}
    >
      <UIView
        mainAxis="center"
        expanded
        style={{ overflow: "hidden", width: "100%" }}
      >
        {isLoading ? (
          <UIDotsLoader />
        ) : (
          <UIView.Animated row>
            <UIText color={getColor(variant, disabled)}>{children}</UIText>
          </UIView.Animated>
        )}
      </UIView>
    </UIButtonContainer>
  );
}

const getColor = (variant: Variant, disabled: boolean): UIThemeColor => {
  if (disabled) return "slateDark";

  if (variant === "filled") return "white";

  return "yellow";
};
