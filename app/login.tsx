import React from "react";
import { Text } from "react-native";
import { WelcomeTitle } from "@/ui-kit/animations/WelcomeTitle";
import { LoginForm } from "@/features/userAuth/LoginForm";
import { UIView } from "@/ui-kit/layout/UIView";
import { theme } from "@/theme";

export default function Login() {
  return (
    <UIView expanded color="greyDark">
      <WelcomeTitle>
        <WelcomeText />
      </WelcomeTitle>
      <LoginForm />
    </UIView>
  );
}

function WelcomeText() {
  return (
    <>
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
        }}
      >
        Welcome to Neibo
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: theme.fontSizes.medium,
          paddingBottom: theme.spacing.large,
          paddingHorizontal: theme.spacing.large,
        }}
      >
        Please login to continue
      </Text>
    </>
  );
}
