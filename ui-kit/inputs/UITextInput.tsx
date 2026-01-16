import { theme } from "@/theme";
import { ComponentProps, useState } from "react";
import { TextInput, StyleSheet } from "react-native";

type UITextInputProps = ComponentProps<typeof TextInput> & {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function UITextInput(props: UITextInputProps) {
  const { placeholder, value, onChangeText, placeholderTextColor, ...rest } =
    props;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <TextInput
      style={[
        styles.input,
        { borderColor: isFocused ? theme.colors.yellow : theme.colors.white },
      ]}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || theme.colors.slateLight}
      cursorColor={theme.colors.slateLight}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
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
    backgroundColor: theme.colors.white,
    color: theme.colors.slateDark,
  },
});
