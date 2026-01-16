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
  FadeOutUp,
  FadeInUp,
} from "react-native-reanimated";
import { Controller } from "react-hook-form";
import { LoginFormData, useLoginForm } from "./useLoginForm";

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useLoginForm(isSignUp);

  const { login, signUp, isLoading } = useAuth();

  const onSubmit = (data: LoginFormData) => {
    if (isSignUp) signUp(data.email, data.password, data.username || "");
    else login(data.email, data.password);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid={true}
      extraScrollHeight={100}
    >
      <UITextInput
        control={control}
        name="email"
        backroundColor="slateLight"
        placeholderTextColor="slate"
        placeholder="Email"
        keyboardType="email-address"
        hasError={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <UIVerticalSpacer height={theme.spacing.medium} />

      <UITextInput
        control={control}
        name="password"
        placeholder="Password"
        backroundColor="slateLight"
        placeholderTextColor="slate"
        // secureTextEntry
        hasError={!!errors.password}
        errorMessage={errors.password?.message}
      />

      {isSignUp ? (
        <UIView.Animated
          linearTransition
          entering={FadeInUp.duration(400)}
          exiting={FadeOutUp.duration(300)}
        >
          <UIVerticalSpacer height={theme.spacing.medium} />

          <UITextInput
            control={control}
            name="username"
            placeholder="Username"
            backroundColor="slateLight"
            placeholderTextColor="slate"
            hasError={!!errors.username}
            errorMessage={errors.username?.message}
          />
        </UIView.Animated>
      ) : null}

      <UIView.Animated linearTransition>
        {!isSignUp && (
          <LoginButtonContainer signUp={false}>
            <UIText color="white">
              <UIText>
                Please Login to continue.If you don not have an account please{" "}
                <UIText
                  onPress={() => {
                    setIsSignUp(true);
                    clearErrors();
                  }}
                  color="yellow"
                >
                  Sign Up
                </UIText>
              </UIText>
            </UIText>
            <UIButton
              isLoading={isLoading}
              variant="outlined"
              onPress={handleSubmit(onSubmit)}
            >
              Login
            </UIButton>
          </LoginButtonContainer>
        )}
        {isSignUp && (
          <LoginButtonContainer signUp={true}>
            <UIText color="white">
              <UIText>
                Please Sign Up. If you already have an account please{" "}
                <UIText
                  onPress={() => {
                    setIsSignUp(false);
                    clearErrors();
                  }}
                  color="yellow"
                >
                  Login
                </UIText>
              </UIText>
            </UIText>
            <UIButton
              isLoading={isLoading}
              variant="outlined"
              onPress={handleSubmit(onSubmit)}
            >
              Sign Up
            </UIButton>
          </LoginButtonContainer>
        )}
      </UIView.Animated>
    </KeyboardAwareScrollView>
  );
}

function LoginButtonContainer({
  children,
  signUp,
}: {
  children: React.ReactNode;
  signUp: boolean;
}) {
  return (
    <UIView.Animated
      paddingTop="xLarge"
      gap="large"
      entering={signUp ? SlideInRight : SlideInLeft}
      exiting={signUp ? SlideOutRight : SlideOutLeft}
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
