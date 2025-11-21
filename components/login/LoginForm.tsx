import { useAuth } from "@/authentication/useAuth";
import { theme } from "@/theme";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UITextInput } from "@/ui-kit/inputs/UITextInput";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UIText } from "../../ui-kit/typography/UIText";
import { UIView } from "@/ui-kit/layout/UIView";
import {
  SlideInRight,
  SlideOutRight,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldSignUp, setShouldSignUp] = useState(false);

  const { login, isLoading } = useAuth();
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <UITextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <UIVerticalSpacer height={theme.spacing.medium} />
      <UITextInput
        placeholder="Password"
        keyboardType="visible-password"
        value={password}
        onChangeText={setPassword}
      />
      {!shouldSignUp && (
        <LoginButtonContainer shouldSignUp={false}>
          <UIText color="white">
            <UIText>
              Please Login to continue.If you don not have an account please{" "}
              <UIText onPress={() => setShouldSignUp(true)} color="yellow">
                Sign Up
              </UIText>
            </UIText>
          </UIText>
          <UIButton
            isLoading={isLoading}
            variant="outlined"
            onPress={() => login(email, password)}
          >
            Login
          </UIButton>
        </LoginButtonContainer>
      )}
      {shouldSignUp && (
        <LoginButtonContainer shouldSignUp={true}>
          <UIText color="white">
            <UIText>
              Please Sign Up. If you already have an account please{" "}
              <UIText onPress={() => setShouldSignUp(false)} color="yellow">
                Login
              </UIText>
            </UIText>
          </UIText>
          <UIButton
            isLoading={isLoading}
            variant="outlined"
            onPress={() => login(email, password)}
          >
            Sign Up
          </UIButton>
        </LoginButtonContainer>
      )}
    </KeyboardAwareScrollView>
  );
}

function LoginButtonContainer({
  children,
  shouldSignUp,
}: {
  children: React.ReactNode;
  shouldSignUp: boolean;
}) {
  return (
    <UIView.Animated
      paddingTop="xLarge"
      gap="large"
      entering={shouldSignUp ? SlideInRight : SlideInLeft}
      exiting={shouldSignUp ? SlideOutRight : SlideOutLeft}
    >
      {children}
    </UIView.Animated>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: theme.spacing.large,
  },
});
