import { StyleSheet, StatusBar, Text } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import { PlantlyButton } from "@/components/PlantlyButton";
import { LinearGradient } from "expo-linear-gradient";
import { PlantlyImage } from "@/components/PlantlyImage";

export default function OnboardingScreen() {
  const toggleOnboarding = useUserStore((state) => state.toggleOnboarding);
  const router = useRouter();
  return (
    <LinearGradient
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 0.5 }}
      colors={[
        theme.colors.green,
        theme.colors.appleGreen,
        theme.colors.limeGreen,
      ]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Plantly</Text>
      <Text style={styles.subtitle}>Keep your plants healthy and happy</Text>
      <PlantlyImage />
      <PlantlyButton
        title="Finish Onboarding"
        onPress={() => {
          toggleOnboarding();
          router.replace("/");
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.large,
  },
  text: {
    fontSize: theme.fontSizes.large,
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.white,
    textAlign: "center",
  },
  title: {
    fontSize: theme.fontSizes.xLarge,
    color: theme.colors.white,
    fontWeight: "bold",
    marginBottom: theme.spacing.medium,
  },
});
