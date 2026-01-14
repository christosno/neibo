import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/constants/navigationOptions";

export default function HomeLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="trip" options={{ title: "Trip" }} />
    </Stack>
  );
}
