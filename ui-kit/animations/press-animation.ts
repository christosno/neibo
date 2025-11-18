import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/spring";
import { BEZIER_EASING } from "../animations/BEZIER_EASING";

type CustomOpacityAnimation = {
  from?: number;
  to: number;
  property: "opacity";
  duration?: number;
};
type CustomScaleAnimation = {
  from?: number;
  to: number;
  property: "scale";
};

const DEFAULT_DURATION = 150;

type StandardAnimation = "fade" | "bounce" | "pop" | "none";
export type PressAnimation =
  | CustomOpacityAnimation
  | CustomScaleAnimation
  | StandardAnimation;

const springConfig: SpringConfig = {
  damping: 15,
  mass: 0.6,
  stiffness: 400,
  overshootClamping: false,
  reduceMotion: ReduceMotion.System,
};

export const usePressStyles = (pressAnimation: PressAnimation) => {
  const isPressedValue = useSharedValue(false);

  const pressStyles = useAnimatedStyle(() => {
    if (pressAnimation === "none") return {};

    if (typeof pressAnimation === "string") {
      switch (pressAnimation) {
        case "fade":
          return {
            opacity: withTiming(isPressedValue.value ? 0.6 : 1, {
              easing: BEZIER_EASING,
            }),
          };
        case "bounce":
          return {
            transform: [
              {
                scale: withSpring(isPressedValue.value ? 0.7 : 1, springConfig),
              },
            ],
          };
        case "pop":
          return {
            transform: [
              {
                scale: withSpring(
                  isPressedValue.value ? 1.05 : 1,
                  springConfig
                ),
              },
            ],
          };
        default:
          return {};
      }
    }

    if ((pressAnimation as CustomScaleAnimation)?.property === "scale") {
      return {
        transform: [
          {
            scale: withSpring(
              isPressedValue.value
                ? (pressAnimation as CustomScaleAnimation)?.to || 1
                : (pressAnimation as CustomScaleAnimation)?.from || 1,
              springConfig
            ),
          },
        ],
      };
    }

    return {
      opacity: withTiming(
        isPressedValue.value
          ? (pressAnimation as CustomOpacityAnimation)?.to || 1
          : (pressAnimation as CustomOpacityAnimation)?.from || 1,
        {
          easing: BEZIER_EASING,
          duration:
            (pressAnimation as CustomOpacityAnimation)?.duration ||
            DEFAULT_DURATION,
        }
      ),
    };
  }, [pressAnimation]);

  return {
    pressStyles,
    updatePressValue: (value: boolean) => {
      isPressedValue.value = value;
    },
  };
};
