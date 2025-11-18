import React from "react";
import { Text } from "react-native";
import { WelcomeTitle } from "@/ui-kit/animations/WelcomeTitle";
import { LoginForm } from "@/components/login/LoginForm";
import { UIView } from "@/ui-kit/layout/UIView";
import { theme } from "@/theme";

export default function Login() {
  return (
    <UIView expanded color="greyDark">
      <WelcomeTitle>Welcome to Neibo</WelcomeTitle>
      <WelcomeText />
      <LoginForm />
    </UIView>
  );
}

function WelcomeText() {
  return (
    //  TODO: Create UIText
    <Text
      style={{
        color: theme.colors.yellowLight,
        textAlign: "center",
        fontSize: theme.fontSizes.medium,
        paddingBottom: theme.spacing.large,
        paddingHorizontal: theme.spacing.large,
      }}
    >
      Please login to continue
    </Text>
  );
}
