import { theme, UIThemeColor } from "@/theme";
import { ComponentProps, useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { UIView } from "../layout/UIView";
import { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { UIText } from "../typography/UIText";
import { Control, Controller } from "react-hook-form";
import { UIVerticalSpacer } from "../layout/UIVerticalSpacer";

type UITextInputProps = ComponentProps<typeof TextInput> & {
  control: Control<any>;
  name: string;
  label?: string;
  labelColor?: UIThemeColor;
  placeholder: string;
  backroundColor?: UIThemeColor;
  placeholderTextColor?: UIThemeColor;
  borderColor?: UIThemeColor;
  hasError?: boolean;
  errorMessage?: string;
  height?: number;
};

export function UITextInput(props: UITextInputProps) {
  const {
    control,
    name,
    label,
    labelColor = "yellow",
    placeholder,
    backroundColor = "white",
    placeholderTextColor = "slateLight",
    borderColor = "yellow",
    hasError = false,
    errorMessage,
    keyboardType = "default",
    height,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <UIView.Animated linearTransition>
      {label && (
        <UIText size="small" align="left" color={labelColor}>
          {label}
        </UIText>
      )}
      <UIVerticalSpacer height={theme.spacing.tiny} />
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
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
                height: height || styles.input.height,
              },
            ]}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor={theme.colors[placeholderTextColor]}
            cursorColor={theme.colors[placeholderTextColor]}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            value={value}
            onChangeText={(text) => onChange(keyboardType === "numeric" ? Number(text) : text)}
            {...rest}
          />
        )}
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
