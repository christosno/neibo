import { theme } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

export default function Trip() {
  return (
    <View style={styles.container}>
      <Text>Trip</Text>
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

