import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/authentication/useAuth";
import { useRequestLocationPermissions } from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultScreenOptions } from "@/constants/navigationOptions";
import { theme } from "@/theme";

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient());
  const initialize = useAuth((state) => state.initialize);
  const isInitializing = useAuth((state) => state.isInitializing);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isGuest = useAuth((state) => state.isGuest);
  const shouldShowLogin = !isAuthenticated && !isGuest;

  useRequestLocationPermissions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.slateDark,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.white} />
      </View>
    );
  }

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
          <Stack.Screen
            name="spot-form"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
