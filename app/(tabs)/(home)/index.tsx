import { PlantCard } from "@/components/PlantCard";
import { usePlantStore } from "@/store/plantsStore";
import { theme } from "@/theme";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NeiboButton } from "@/components/NeiboButton";
import { useRouter } from "expo-router";

export default function App() {
  const plants = usePlantStore((state) => state.plants);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        renderItem={({ item }) => <PlantCard plant={item} />}
        contentContainerStyle={{ paddingVertical: theme.spacing.xLarge }}
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.spacing.medium }} />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: theme.spacing.large,
            }}
          >
            <Text>No plants found</Text>
            <NeiboButton
              title="Add Plant"
              onPress={() => router.push("/new")}
            />
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
