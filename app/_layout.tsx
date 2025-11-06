import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="onBoarding"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
