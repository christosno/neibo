import React from "react";
import { Text } from "react-native";
import { WelcomeTitle } from "@/ui-kit/animations/WelcomeTitle";
import { LoginForm } from "@/features/userAuth/LoginForm";
import { UIView } from "@/ui-kit/layout/UIView";
import { theme } from "@/theme";
import { UIText } from "@/ui-kit/typography/UIText";
import { UIVerticalSpacer } from "@/ui-kit/layout/UIVerticalSpacer";
import { UIButton } from "@/ui-kit/buttons/UIButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
  return (
    <UIView.Animated linearTransition expanded color="slateDark">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
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
      <UIButton variant="outlined" onPress={() => {}}>
        Continue as Guest
      </UIButton>
    </UIView.Animated>
  );
}
