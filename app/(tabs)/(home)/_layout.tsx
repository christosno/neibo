import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { theme } from "@/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <Link href="/new" asChild>
              <Pressable
                style={{ marginRight: theme.spacing.large }}
                hitSlop={20}
              >
                <AntDesign
                  name="plus-circle"
                  color={theme.colors.green}
                  size={24}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="plants/[plantId]"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
