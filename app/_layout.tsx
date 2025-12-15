import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/authentication/useAuth";
import { useRequestLocationPermissions } from "@/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Layout() {
  const queryClient = new QueryClient();
  const user = useAuth((state) => {
    return state.user;
  });
  console.log("🚀 ~ Layout ~ user:", user);
  useRequestLocationPermissions();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
