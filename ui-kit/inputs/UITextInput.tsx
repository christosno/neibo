import { theme, UIThemeColor } from "@/theme";
import { ComponentProps, useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { UIView } from "../layout/UIView";
import { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { UIText } from "../typography/UIText";

type UITextInputProps = ComponentProps<typeof TextInput> & {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  backroundColor?: UIThemeColor;
  placeholderTextColor?: UIThemeColor;
  borderColor?: UIThemeColor;
  hasError?: boolean;
  errorMessage?: string;
};

export function UITextInput(props: UITextInputProps) {
  const {
    placeholder,
    backroundColor = "white",
    value,
    onChangeText,
    placeholderTextColor = "slateLight",
    borderColor = "yellow",
    hasError = false,
    onFocus,
    onBlur,
    errorMessage,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <UIView.Animated linearTransition>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors[backroundColor],
            borderColor: hasError
              ? theme.colors.error
              : isFocused
                ? theme.colors[borderColor]
                : theme.colors[backroundColor],
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors[placeholderTextColor]}
        cursorColor={theme.colors[placeholderTextColor]}
        onFocus={(e) => {
          onFocus?.(e);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setIsFocused(false);
        }}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {hasError && (
        <UIView.Animated entering={FadeInUp} exiting={FadeOutUp}>
          <UIText
            size="small"
            style={{ paddingLeft: theme.spacing.small }}
            align="left"
            color="error"
          >
            {errorMessage}
          </UIText>
        </UIView.Animated>
      )}
    </UIView.Animated>
  );
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 4,
    height: 42,
    width: "100%",
    borderWidth: 2,
    borderRadius: theme.border.radius.xlarge,
    paddingHorizontal: 15,
    color: theme.colors.slateDark,
  },
});
