import { theme } from "@/theme";
import { ComponentProps, useState } from "react";
import { TextInput, StyleSheet } from "react-native";

type UITextFieldProps = ComponentProps<typeof TextInput> & {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function UITextField(props: UITextFieldProps) {
  const { placeholder, value, onChangeText, ...rest } = props;
  const [isFocused, setIsFocused] = useState(false);
  return (
    <TextInput
      style={[
        styles.input,
        { borderColor: isFocused ? theme.colors.yellow : theme.colors.white },
      ]}
      placeholder={placeholder}
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
    height: 40,
    width: "100%",
    borderWidth: 2,
    borderRadius: theme.border.radius.xlarge,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
  },
});
