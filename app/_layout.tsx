import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/authentication/useAuth";
import { useRequestLocationPermissions } from "@/hooks";

export default function Layout() {
  const user = useAuth((state) => state.user);
  useRequestLocationPermissions();
  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
