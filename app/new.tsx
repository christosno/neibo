import { View, StyleSheet, Alert } from "react-native";
import { theme } from "@/theme";
import { PlantlyImage } from "@/components/PlantlyImage";
import { FormInput } from "@/components/FormInput";
import { PlantlyButton } from "@/components/PlantlyButton";
import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePlantStore } from "@/store/plantsStore";

export default function NewScreen() {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
    >
      <View style={{ alignItems: "center" }}>
        <PlantlyImage />
      </View>
      <PlantlyForm />
    </KeyboardAwareScrollView>
  );
}

function PlantlyForm() {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const addPlant = usePlantStore((state) => state.addPlant);
  const router = useRouter();

  const handleAddPlant = () => {
    if (!name) {
      return Alert.alert("Validation Error", "Give your plant a name");
    }

    if (!days) {
      return Alert.alert(
        "Validation Error",
        `How often does ${name} need to be watered?`
      );
    }

    if (Number.isNaN(Number(days))) {
      return Alert.alert(
        "Validation Error",
        "Watering frequency must be a be a number"
      );
    }

    addPlant(name, Number(days));
    setName("");
    setDays("");
    router.replace("/");
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.formInputs}>
        <FormInput
          label="Name"
          placeholder="E.g. Casper the cactus"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <FormInput
          label="Watering Frequency"
          placeholder="E.g. 3 times a week"
          value={days}
          onChangeText={setDays}
          keyboardType="number-pad"
        />
      </View>
      <PlantlyButton title="Add Plant" onPress={handleAddPlant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    paddingTop: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
  },
  formContainer: {
    width: "100%",
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  formInputs: {
    gap: theme.spacing.medium,
  },
});
