import { View, StyleSheet } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { NeiboButton } from "@/components/NeiboButton";

export default function ProfileScreen() {
  const toggleOnboarding = useUserStore((state) => state.toggleOnboarding);
  return (
    <View style={styles.container}>
      <NeiboButton title="Logout" onPress={toggleOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  text: {
    fontSize: theme.fontSizes.large,
  },
});
