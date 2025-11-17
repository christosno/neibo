import { useAuth } from "@/authentication/useAuth";
import { theme } from "@/theme";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, signUp } = useAuth();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={() => login(email, password)} />
      <Button title="Sign Up" onPress={() => signUp(email, password)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.medium,
  },
  input: {
    marginVertical: 4,
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
