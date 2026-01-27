import { Tabs } from "expo-router";
import {
  defaultScreenOptions,
  defaultTabBarOptions,
} from "@/constants/navigationOptions";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";

export default function Layout() {
  if (Platform.OS === "android") {
    return (
      <Tabs
        screenOptions={{
          ...defaultScreenOptions,
          ...defaultTabBarOptions,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    );
  }
  return (
    <NativeTabs
      backgroundColor={theme.colors.slateDark}
      blurEffect="none"
      iconColor={theme.colors.slateLight}
      tintColor={theme.colors.slateLight}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger
        name="(home)"
        options={{
          title: "Home",
        }}
      >
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="ic_menu_myplaces" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)" options={{ title: "Profile" }}>
        <Label>Profile</Label>
        <Icon sf="person.fill" drawable="ic_menu_preferences" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
