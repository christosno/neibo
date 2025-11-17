import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/authentication/useAuth";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/theme";

export default function Layout() {
  const user = useAuth((state) => state.user);
  const initializing = useAuth((state) => state.initializing);
  const setUser = useAuth((state) => state.setUser);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => setUser(user));
    return subscriber;
  }, [setUser]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.green} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
