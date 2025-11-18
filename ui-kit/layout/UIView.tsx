import { useThrottle } from "@/hooks";
import React, { ComponentProps } from "react";
import {
  FlexStyle,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedProps,
  AnimatedStyle,
  CSSTransitionProperty,
  LinearTransition,
} from "react-native-reanimated";
import { PlainStyle } from "react-native-reanimated/lib/typescript/css/types";
import { BEZIER_EASING, BEZIER_TIMING_FN } from "../animations/BEZIER_EASING";
import { PressAnimation, usePressStyles } from "../animations/press-animation";
import {
  theme,
  UIThemeBorder,
  UIThemeBorderRadius,
  UIThemeBorderWidth,
  UIThemeColor,
  UIThemeShadow,
  UIThemeSpacing,
} from "@/theme";

type DynamicStyleProps = {
  color?: UIThemeColor;
  shadow?: UIThemeShadow;
  crossAxis?: FlexStyle["alignItems"];
  mainAxis?: FlexStyle["justifyContent"];
  wrap?: boolean;
  border?: UIThemeBorder;
  borderTop?: UIThemeBorder;
  borderRight?: UIThemeBorder;
  borderBottom?: UIThemeBorder;
  borderLeft?: UIThemeBorder;
  borderRadius?: UIThemeBorderRadius;
  gap?: UIThemeSpacing;
  expanded?: boolean;
  size?: number;
  row?: boolean;
  circle?: boolean;
  padding?: UIThemeSpacing;
  paddingBottom?: UIThemeSpacing;
  paddingTop?: UIThemeSpacing;
  paddingLeft?: UIThemeSpacing;
  paddingRight?: UIThemeSpacing;
  paddingVertical?: UIThemeSpacing;
  paddingHorizontal?: UIThemeSpacing;
  margin?: UIThemeSpacing;
  marginBottom?: UIThemeSpacing;
  marginTop?: UIThemeSpacing;
  marginLeft?: UIThemeSpacing;
  marginRight?: UIThemeSpacing;
  marginHorizontal?: UIThemeSpacing;
  marginVertical?: UIThemeSpacing;
  absolute?: boolean;
  translateX?: number;
  translateY?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
} & Pick<
  ViewStyle,
  | "height"
  | "width"
  | "opacity"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "zIndex"
  | "alignSelf"
>;

type UIViewProps = ViewProps & DynamicStyleProps;
export function UIView({
  // Custom Props
  color,
  row = false,
  circle,
  size,
  crossAxis,
  mainAxis,
  wrap,
  gap,
  shadow,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderRadius,
  expanded,
  padding,
  paddingBottom,
  paddingTop,
  paddingLeft,
  paddingRight,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  translateX,
  translateY,
  scale,
  absolute,
  // Base View Props
  zIndex,
  top,
  right,
  bottom,
  left,
  height,
  width,
  alignSelf,
  opacity,
  style,
  ...rest
}: UIViewProps) {
  const dynamicStyles = useDynamicStyles<ViewStyle>({
    absolute,
    alignSelf,
    borderRadius,
    circle,
    bottom,
    color,
    crossAxis,
    expanded,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    gap,
    height,
    left,
    mainAxis,
    margin,
    marginBottom,
    marginHorizontal,
    marginLeft,
    marginRight,
    marginTop,
    marginVertical,
    wrap,
    opacity,
    padding,
    paddingBottom,
    paddingHorizontal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingVertical,
    right,
    row,
    scale,
    shadow,
    size,
    top,
    translateX,
    translateY,
    width,
    zIndex,
  });

  return <View style={[dynamicStyles, style]} {...rest} />;
}

type UIViewAnimatedProps = Omit<
  AnimatedProps<ViewProps> & DynamicStyleProps,
  "style" | "opacity" | "translateX" | "translateY" | "scale"
> & {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  linearTransition?: boolean;
  transitionDuration?: number;
  transitionProperty?: CSSTransitionProperty<PlainStyle>;
};

function UIViewAnimated({
  // Custom Props
  color,
  row,
  size,
  crossAxis,
  mainAxis,
  wrap,
  gap,
  shadow,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  expanded,
  padding,
  paddingBottom,
  paddingTop,
  paddingLeft,
  paddingRight,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  absolute,
  circle,
  // Base View Props
  top,
  right,
  bottom,
  left,
  borderRadius,
  height,
  width,
  zIndex,
  alignSelf,
  linearTransition,
  transitionDuration,
  layout,
  style,
  ...rest
}: UIViewAnimatedProps) {
  const dynamicStyles = useDynamicStyles<AnimatedStyle<ViewStyle>>(
    {
      absolute,
      alignSelf,
      borderRadius,
      border,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      bottom,
      circle,
      color,
      crossAxis,
      expanded,
      gap,
      height,
      left,
      mainAxis,
      margin,
      marginBottom,
      marginHorizontal,
      marginLeft,
      marginRight,
      marginTop,
      marginVertical,
      wrap,
      padding,
      paddingBottom,
      paddingHorizontal,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingVertical,
      right,
      row,
      shadow,
      size,
      top,
      width,
      zIndex,
    },
    true
  );

  return (
    <Animated.View
      style={[
        dynamicStyles,
        {
          // Defaults for animations
          transitionProperty: "none",
          transitionTimingFunction: BEZIER_TIMING_FN,
          transitionDuration: 300,
        },
        style,
      ]}
      layout={
        linearTransition
          ? LinearTransition.duration(transitionDuration ?? 300).easing(
              BEZIER_EASING
            )
          : layout
      }
      {...rest}
    />
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type UIAnimatedPressableProps = ComponentProps<typeof Pressable> &
  ComponentProps<typeof UIViewAnimated> & {
    pressAnimation?: PressAnimation;
    preventDoubleTap?: boolean;
    parentViewStyle?: StyleProp<ViewStyle>;
  };

function UIAnimatedPressable({
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  preventDoubleTap = false,
  disabled = false,
  linearTransition,
  transitionDuration,
  pressAnimation = "fade",
  expanded,
  delayLongPress,
  unstable_pressDelay,
  parentViewStyle, // Use only for example adding position absolute
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
  testID,
  ...props
}: UIAnimatedPressableProps) {
  const throttledOnPress = useThrottle(onPress ?? (() => null), 500);

  const { pressStyles, updatePressValue } = usePressStyles(pressAnimation);

  const handleOnPress = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (!preventDoubleTap) return onPress?.(e);
    throttledOnPress(e);
  };

  return (
    <AnimatedPressable
      onPress={handleOnPress}
      onPressIn={(e) => {
        updatePressValue(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        updatePressValue(false);
        onPressOut?.(e);
      }}
      unstable_pressDelay={unstable_pressDelay}
      delayLongPress={delayLongPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={[{ flex: expanded ? 1 : 0 }, parentViewStyle, pressStyles]}
      layout={
        linearTransition
          ? LinearTransition.duration(transitionDuration ?? 300).easing(
              BEZIER_EASING
            )
          : undefined
      }
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      testID={testID}
    >
      <UIView.Animated
        linearTransition={linearTransition}
        transitionDuration={transitionDuration}
        expanded={expanded}
        {...props}
      />
    </AnimatedPressable>
  );
}

const useDynamicStyles = <T,>(
  {
    color,
    row = false,
    size,
    crossAxis,
    mainAxis,
    wrap = false,
    gap,
    shadow,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    expanded = false,
    padding,
    paddingBottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingVertical,
    paddingHorizontal,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    translateX,
    translateY,
    circle,
    scale,
    absolute = false,
    // Base View Props
    zIndex,
    top,
    right,
    bottom,
    left,
    borderRadius,
    height,
    width,
    alignSelf,
    opacity,
  }: DynamicStyleProps,
  animated = false
) => {
  return {
    backgroundColor: color ? theme.colors[color] : undefined,
    flexDirection: row ? "row" : "column",
    alignItems: crossAxis ?? (row || circle ? "center" : "stretch"),
    justifyContent: mainAxis ?? (row || circle ? "center" : "center"),
    flexWrap: wrap ? "wrap" : "nowrap",
    boxShadow: shadow,
    ...(border ? borderStyles(border) : {}),
    ...(borderBottom
      ? {
          borderBottomWidth:
            theme.border.width[parseBorder(borderBottom).width],
          borderBottomColor: theme.colors[parseBorder(borderBottom).color],
        }
      : {}),
    ...(borderLeft
      ? {
          borderLeftWidth: theme.border.width[parseBorder(borderLeft).width],
          borderLeftColor: theme.colors[parseBorder(borderLeft).color],
        }
      : {}),
    ...(borderTop
      ? {
          borderTopWidth: theme.border.width[parseBorder(borderTop).width],
          borderTopColor: theme.colors[parseBorder(borderTop).color],
        }
      : {}),
    ...(borderRight
      ? {
          borderRightWidth: theme.border.width[parseBorder(borderRight).width],
          borderRightColor: theme.colors[parseBorder(borderRight).color],
        }
      : {}),
    flex: expanded ? 1 : 0,
    position: absolute ? "absolute" : "relative",
    top,
    right,
    bottom,
    left,
    zIndex,
    ...(gap
      ? { rowGap: theme.spacing[gap], columnGap: theme.spacing[gap] }
      : {}),
    padding: padding ? theme.spacing[padding] : undefined,
    paddingBottom: paddingBottom ? theme.spacing[paddingBottom] : undefined,
    paddingTop: paddingTop ? theme.spacing[paddingTop] : undefined,
    paddingLeft: paddingLeft ? theme.spacing[paddingLeft] : undefined,
    paddingRight: paddingRight ? theme.spacing[paddingRight] : undefined,
    paddingVertical: paddingVertical
      ? theme.spacing[paddingVertical]
      : undefined,
    paddingHorizontal: paddingHorizontal
      ? theme.spacing[paddingHorizontal]
      : undefined,
    margin: margin ? theme.spacing[margin] : undefined,
    marginTop: marginTop ? theme.spacing[marginTop] : undefined,
    marginBottom: marginBottom ? theme.spacing[marginBottom] : undefined,
    marginLeft: marginLeft ? theme.spacing[marginLeft] : undefined,
    marginRight: marginRight ? theme.spacing[marginRight] : undefined,
    marginHorizontal: marginHorizontal
      ? theme.spacing[marginHorizontal]
      : undefined,
    marginVertical: marginVertical ? theme.spacing[marginVertical] : undefined,
    minWidth: size ?? width,
    minHeight: size ?? height,
    borderRadius:
      circle && size
        ? "50%"
        : borderRadius
          ? theme.border.radius[borderRadius]
          : undefined,
    aspectRatio: circle ? 1 : undefined,
    alignSelf,
    // Avoids pixel overflows when combining border radius and border width
    overflow: circle && border ? "hidden" : undefined,
    // Don't use opacity or transform on animated components since can override entering/exiting animations
    ...(animated
      ? {}
      : {
          opacity,
          transform: [
            { translateX: translateX ?? 0 },
            { translateY: translateY ?? 0 },
            { scale: scale ?? 1 },
          ],
        }),
  } as T;
};

const parseBorder = (border: UIThemeBorder) => {
  const [color, width] = border.split(".");
  return {
    color: color as UIThemeColor,
    width: width as UIThemeBorderWidth,
  };
};

const borderStyles = (border: UIThemeBorder) => {
  const { color, width } = parseBorder(border);
  return {
    borderWidth: theme.border.width[width],
    borderColor: theme.colors[color],
  };
};

UIView.Animated = UIViewAnimated;
UIView.Pressable = UIAnimatedPressable;
