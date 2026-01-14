import React, { useEffect } from "react";
import {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { UIView } from "../layout/UIView";

const DOTS_LENGTH = 3;
export function UIDotsLoader() {
  const loadingValue = useSharedValue(-1);

  useEffect(() => {
    loadingValue.value = withRepeat(
      withSequence(
        withTiming(DOTS_LENGTH, { duration: 900, easing: Easing.linear })
      ),
      -1
    );
  }, [loadingValue]);

  return (
    <UIView row gap="small">
      {Array.from({ length: DOTS_LENGTH }).map((_, index) => (
        <Dot key={index} index={index} loadingValue={loadingValue} />
      ))}
    </UIView>
  );
}

function Dot({
  index,
  loadingValue,
}: {
  index: number;
  loadingValue: SharedValue<number>;
}) {
  const dotStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          loadingValue.value,
          [index - 1, index, index + 1],
          [1, 1.5, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  // TODO: theme check color
  return (
    <UIView.Animated
      size={4}
      border="white.small"
      circle
      color="slateDark"
      style={dotStyle}
    />
  );
}
