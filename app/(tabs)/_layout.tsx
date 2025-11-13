import { Redirect, SplashScreen, Tabs } from "expo-router";
import { Feather, Entypo } from "@expo/vector-icons";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";

export default function Layout() {
  SplashScreen.hideAsync();
  const hasFinishedOnboarding = useUserStore(
    (state) => state.hasFinishedOnboarding
  );

  if (!hasFinishedOnboarding) {
    return <Redirect href="/onBoarding" />;
  }
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.green }}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="leaf" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
