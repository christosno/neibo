import { Tabs } from "expo-router";
import {
  defaultScreenOptions,
  defaultTabBarOptions,
} from "@/constants/navigationOptions";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        ...defaultScreenOptions,
        ...defaultTabBarOptions,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
