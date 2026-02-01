import { defaultScreenOptions } from "@/constants/navigationOptions";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerRight: () => (
            <Ionicons
              name="person-circle-outline"
              size={35}
              color={theme.colors.slateLight}
            />
          ),
        }}
      />
      <Stack.Screen name="createTour" options={{ title: "Create Tour" }} />
      <Stack.Screen name="myTours" options={{ title: "My Tours" }} />
    </Stack>
  );
}
