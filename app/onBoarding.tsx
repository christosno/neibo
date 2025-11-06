import { Text, View, StyleSheet, Button } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const toggleOnboarding = useUserStore((state) => state.toggleOnboarding);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding</Text>
      <Button
        title="Finish Onboarding"
        onPress={() => {
          toggleOnboarding();
          router.replace("/");
        }}
      />
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
