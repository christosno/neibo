import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";

export function WelcomeTitle({ children }: { children: ReactNode }) {
  return (
    <MaskedView
      style={styles.maskedView}
      maskElement={
        <View
          style={{
            // Transparent background because mask is based off alpha channel.
            backgroundColor: "transparent",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </View>
      }
    >
      <Animated.View
        style={[
          styles.gradient,
          {
            animationName: {
              to: {
                transform: [{ rotate: "360deg" }],
              },
            },
            animationDuration: "4s",
            animationIterationCount: "infinite",
          },
        ]}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  maskedView: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    zIndex: 0,
  },
  gradient: {
    experimental_backgroundImage:
      "linear-gradient(to right, #3b0764, #991b1b, #fbbf24)",
    width: "100%",
    height: "100%",
  },
});
