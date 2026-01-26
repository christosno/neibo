import { defaultScreenOptions } from "@/constants/navigationOptions";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return <Stack screenOptions={{
            ...defaultScreenOptions,
          }}> 
          <Stack.Screen name="index" options={{ title: "Profile" }} />
          <Stack.Screen name="createTour" options={{ title: "Create Tour" }} />
          </Stack>;
}