import { ComponentProps } from "react";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

import { UIView } from "./UIView";
import { theme } from "@/theme";

type SafeAreaUIViewProps = ComponentProps<typeof UIView> & {
  edges?: Edge[];
};

export function SafeAreaUIView({
  edges,
  color,
  ...uiViewProps
}: SafeAreaUIViewProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={{
        flex: 1,
        backgroundColor: color ? theme.colors[color] : undefined,
      }}
    >
      <UIView expanded color={color} {...uiViewProps} />
    </SafeAreaView>
  );
}
