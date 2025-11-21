import { theme } from "@/theme";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/(tabs)/(home)/trip" asChild>
        <UIButton variant="outlined" extended onPress={() => {}}>
          Go to Trip Screen
        </UIButton>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.medium,
  },
});
