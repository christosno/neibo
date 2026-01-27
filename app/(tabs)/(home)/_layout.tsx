import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/constants/navigationOptions";

export default function HomeLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="(aiTour)" options={{ title: "Create a tour with AI" }} />
      <Stack.Screen name="tour/[id]" options={{ title: "Tour" }} />
    </Stack>
  );
}
