import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/authentication/useAuth";
import { useRequestLocationPermissions } from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultScreenOptions } from "@/constants/navigationOptions";
import { theme } from "@/theme";

export default function Layout() {
  const queryClient = new QueryClient();
  const isAuthenticated = useAuth((state) => {
    return state.isAuthenticated;
  });
  const isGuest = useAuth((state) => {
    return state.isGuest;
  });
  const shouldShowLogin = !isAuthenticated && !isGuest;
  useRequestLocationPermissions();
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: theme.colors.slateDark }}>
        <Stack screenOptions={defaultScreenOptions}>
        <Stack.Protected guard={!shouldShowLogin}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={shouldShowLogin}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      </View>
    </QueryClientProvider>
  );
}
