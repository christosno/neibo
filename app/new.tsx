import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { theme } from "@/theme";
import { PlantlyImage } from "@/components/PlantlyImage";
import { FormInput } from "@/components/FormInput";
import { PlantlyButton } from "@/components/PlantlyButton";
import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePlantStore } from "@/store/plantsStore";
import * as ImagePicker from "expo-image-picker";

export default function NewScreen() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const handleImagePress = async () => {
    if (Platform.OS === "web") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets?.[0]?.uri);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={100}
      keyboardOpeningTime={0}
    >
      <TouchableOpacity
        style={{ alignItems: "center", paddingBottom: theme.spacing.large }}
        activeOpacity={0.8}
        onPress={handleImagePress}
      >
        <PlantlyImage imageUri={image} />
      </TouchableOpacity>
      <PlantlyForm imageUri={image} />
    </KeyboardAwareScrollView>
  );
}

function PlantlyForm({ imageUri }: { imageUri?: string }) {
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

    addPlant({ name, wateringFrequencyDays: Number(days), imageUri });
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
