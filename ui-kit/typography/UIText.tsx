import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import Animated, {
  AnimatedProps,
  AnimatedStyle,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { BEZIER_EASING, BEZIER_TIMING_FN } from "../animations/BEZIER_EASING";
import { theme, UIThemeColor, UIThemeFontSize } from "@/theme";

type UIAnimatedTextStyle = AnimatedProps<TextProps>["style"];
type UITextStyle = StyleProp<TextStyle>;

type Align = "center" | "left" | "right" | "auto" | "justify";
type Truncate = "start" | "middle" | "end";
type Transform = "uppercase" | "lowercase" | "capitalize" | "none";

type Props = {
  color?: UIThemeColor;
  size?: UIThemeFontSize;
  font?: string;
  lineHeight?: number;
  selectable?: boolean;
  align?: Align;
  style?: UITextStyle;
  truncate?: Truncate;
  transform?: Transform;
  expanded?: boolean;
  numberOfLines?: number;
  children: string | number | ReactNode;
  onTextLayout?: TextProps["onTextLayout"];
  onPress?: () => void;
  testID?: string;
};

const ParentProps = createContext<Props | undefined>(undefined);

export function UIText(props: Props) {
  const parentProps = useContext(ParentProps);

  const finalProps = parentProps ? { ...parentProps, ...props } : props;

  const {
    size = "medium",
    color = "black",
    align: textAlign = "center",
    style,
    selectable = false,
    children,
    truncate,
    expanded = false,
    transform: textTransform = "none",
    numberOfLines,
    onTextLayout,
    onPress,
    testID,
  } = finalProps;

  const finalStyles = [
    {
      color: theme.colors[color],
      textAlign: textAlign ?? "center",
      fontSize: theme.fontSizes[size],
      textTransform,
      flex: expanded ? 1 : 0,
    },
    style,
  ];

  const rnTruncProps = useMemo(() => getTruncProps(truncate), [truncate]);

  return (
    <ParentProps.Provider value={finalProps}>
      <Text
        {...rnTruncProps}
        testID={testID}
        style={finalStyles as StyleProp<TextStyle>}
        selectable={selectable}
        numberOfLines={numberOfLines}
        onTextLayout={onTextLayout}
        maxFontSizeMultiplier={2}
        onPress={onPress}
      >
        {children}
      </Text>
    </ParentProps.Provider>
  );
}

function AnimatedText(
  props: Omit<Props, "style"> & {
    style?: UIAnimatedTextStyle;
    transitionColor?: boolean;
    fadeOnTextChange?: boolean;
  } & AnimatedProps<TextProps>
) {
  const parentProps = useContext(ParentProps);

  const finalProps = parentProps ? { ...parentProps, ...props } : props;

  const {
    size = "medium",
    color = "black",
    align: textAlign = "center",
    style,
    selectable = false,
    children,
    truncate,
    expanded = false,
    transform: textTransform = "none",
    numberOfLines,
    fadeOnTextChange,
    transitionColor,
    onTextLayout,
    onPress,
    testID,
    ...rest
  } = finalProps;

  const finalStyles = [
    {
      color: theme.colors[color],
      textAlign,
      fontSize: theme.fontSizes[size],
      textTransform,
      flex: expanded ? 1 : 0,
      transitionProperty: transitionColor ? "color" : undefined,
      transitionDuration: transitionColor ? 300 : undefined,
      transitionTimingFunction: transitionColor ? BEZIER_TIMING_FN : undefined,
    },
    style,
  ];

  const rnTruncProps = useMemo(() => getTruncProps(truncate), [truncate]);

  return (
    <ParentProps.Provider value={{ ...finalProps, style: {} }}>
      {
        <Animated.Text
          {...rnTruncProps}
          entering={fadeOnTextChange ? FadeIn.easing(BEZIER_EASING) : undefined}
          exiting={fadeOnTextChange ? FadeOut.easing(BEZIER_EASING) : undefined}
          key={fadeOnTextChange ? children?.toString() : undefined}
          testID={testID}
          style={finalStyles as StyleProp<AnimatedStyle<TextStyle>>}
          selectable={selectable}
          numberOfLines={numberOfLines}
          onTextLayout={onTextLayout}
          onPress={onPress}
          maxFontSizeMultiplier={2}
          {...rest}
        >
          {children}
        </Animated.Text>
      }
    </ParentProps.Provider>
  );
}

UIText.Animated = AnimatedText;

function getTruncProps(truncate?: Truncate): TextProps {
  if (truncate)
    return {
      numberOfLines: 1,
      ellipsizeMode: mapToRnEllipsizeMode(truncate),
    };
  return {};
}

type RnEllipsizeModeMapper = (
  truncate: Truncate
) => "head" | "tail" | "middle" | "clip";
const mapToRnEllipsizeMode: RnEllipsizeModeMapper = (truncate) => {
  if (truncate === "start") return "head";
  if (truncate === "end") return "tail";
  return "middle";
};
