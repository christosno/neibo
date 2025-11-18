import { useAuth } from "@/authentication/useAuth";
import { theme } from "@/theme";
import { UITextField } from "@/ui-kit/inputs/UITextField";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { useState } from "react";
import { StyleSheet, Button } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, signUp } = useAuth();
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <UITextField
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <UIVerticalSpacer height={theme.spacing.medium} />
      <UITextField
        placeholder="Password"
        keyboardType="visible-password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={() => login(email, password)} />
      <Button title="Sign Up" onPress={() => signUp(email, password)} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing.large,
  },
});
