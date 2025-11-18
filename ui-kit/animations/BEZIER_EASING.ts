import { cubicBezier, Easing } from "react-native-reanimated";

export const BEZIER_TIMING_FN = cubicBezier(0.4, 0, 0.2, 1);
export const BEZIER_EASING = Easing.bezierFn(0.4, 0, 0.2, 1);
