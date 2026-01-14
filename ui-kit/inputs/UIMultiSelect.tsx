import { theme } from "@/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UIText } from "../typography/UIText";

type UIMultiSelectProps<T extends string> = {
  placeholder: string;
  value: T[];
  onChange: (value: T[]) => void;
  options: { label: string; value: T }[];
  error?: string;
};

export function UIMultiSelect<T extends string>(props: UIMultiSelectProps<T>) {
  const { value, onChange, options, error } = props;

  const toggleOption = (optionValue: T) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <View>
      {value.length > 0 && (
        <View style={styles.selectedContainer}>
          {value.map((selectedValue) => {
            const option = options.find((opt) => opt.value === selectedValue);
            return (
              <View key={selectedValue} style={styles.chip}>
                <UIText color="black" size={theme.fontSizes.small} align="left">
                  {option?.label || selectedValue}
                </UIText>
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => {
                toggleOption(option.value);
              }}
            >
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && (
                  <UIText color="black" size={theme.fontSizes.small}>
                    ✓
                  </UIText>
                )}
              </View>
              <UIText
                color={isSelected ? "black" : "white"}
                size={theme.fontSizes.medium}
                align="left"
                style={styles.optionLabel}
              >
                {option.label}
              </UIText>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && (
        <UIText
          size={theme.fontSizes.small}
          style={{
            paddingLeft: theme.spacing.small,
            paddingTop: theme.spacing.tiny,
          }}
          align="left"
          color="error"
        >
          {error}
        </UIText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: theme.spacing.medium,
  },
  chip: {
    backgroundColor: theme.colors.yellowLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.border.radius.medium,
  },
  optionsContainer: {
    marginTop: 8,
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  selectedOption: {
    opacity: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: theme.border.radius.small,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.yellow,
    borderColor: theme.colors.yellow,
  },
  optionLabel: {
    flex: 1,
  },
});
