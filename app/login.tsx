import React from "react";
import { StyleSheet, Text } from "react-native";
import { WelcomeTitle } from "@/ui-kit/animations/WelcomeTitle";
import { LoginForm } from "@/features/userAuth/LoginForm";
import { UIView } from "@/ui-kit/layout/UIView";
import { theme } from "@/theme";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UITextButton } from "@/ui-kit/buttons/UITextButton";
import { useAuth } from "@/authentication/useAuth";

export default function Login() {
  return (
    <UIView.Animated linearTransition expanded color="slateDark">
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        <WelcomeTitle heightPercentage={30}>
          <WelcomeText />
        </WelcomeTitle>
        <LoginComponent />
        <UIVerticalSpacer height={40} />
        <ContinueAsGuest />
      </KeyboardAwareScrollView>
    </UIView.Animated>
  );
}

function WelcomeText() {
  return (
    <>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Neibo
      </Text>
    </>
  );
}

function LoginComponent() {
  return (
    <UIView gap="medium">
      <UIText size="large" align="center" color="yellow">
        Login
      </UIText>
      <LoginForm />
    </UIView>
  );
}

function ContinueAsGuest() {
  const  continueAsGuest  = useAuth(state => state.continueAsGuest);
  return (
    <UIView.Animated
      linearTransition
      gap="medium"
      mainAxis="center"
      crossAxis="center"
    >
      <UIText size="medium" align="center" color="yellow">
        or
      </UIText>
      <UITextButton onPress={continueAsGuest}>Continue as Guest</UITextButton>
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
