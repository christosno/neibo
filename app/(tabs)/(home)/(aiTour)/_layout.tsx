import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/constants/navigationOptions";

export default function AiTourLayout() {
  return (
    <Stack screenOptions={{...defaultScreenOptions, headerShown: false}}>
      <Stack.Screen name="index" options={{ title: "Create a tour with AI" }} />
      <Stack.Screen name="aiTrip" options={{ title: "Trip" }} />
    </Stack>
  );
}
