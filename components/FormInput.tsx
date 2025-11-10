import { theme } from "@/theme";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

type FormInputProps = TextInputProps & { label: string };

export function FormInput(props: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput {...props} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    color: theme.colors.leafyGreen,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    paddingBottom: theme.spacing.tiny,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.appleGreen,
    borderRadius: 10,
    padding: 12,
    backgroundColor: theme.colors.white,
  },
});
