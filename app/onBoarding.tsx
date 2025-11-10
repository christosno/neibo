import { View, StyleSheet } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import { PlantlyButton } from "@/components/PlantlyButton";

export default function OnboardingScreen() {
  const toggleOnboarding = useUserStore((state) => state.toggleOnboarding);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <PlantlyButton
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
