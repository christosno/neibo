import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/constants/navigationOptions";

export default function HomeLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="ai-tour" options={{ title: "Create a tour with AI" }} />
      <Stack.Screen name="aiTrip" options={{ title: "Trip" }} />
      <Stack.Screen name="walk/[id]" options={{ title: "Tour" }} />
    </Stack>
  );
}
