import { theme, UIThemeColor } from "@/theme";
import { useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Modal,
} from "react-native";
import { UIText } from "../typography/UIText";
import { UIView } from "../layout/UIView";
import { UIVerticalSpacer } from "../layout/UIVerticalSpacer";

type UISelectProps<T extends string> = {
  placeholder: string;
  value: T | undefined;
  label?: string;
  labelColor?: UIThemeColor;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  error?: string;
};

export function UISelect<T extends string>(props: UISelectProps<T>) {
  const {
    placeholder,
    value,
    label,
    labelColor = "yellow",
    onChange,
    options,
    error,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectPosition, setSelectPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const selectRef = useRef<View>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    selectRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        setSelectPosition({ x, y, width, height });
        setIsOpen(true);
        setIsFocused(true);
      }
    );
  };

  return (
    <UIView.Animated linearTransition>
      {label && (
        <UIText size="small" align="left" color={labelColor}>
          {label}
        </UIText>
      )}
      <UIVerticalSpacer height={theme.spacing.tiny} />
      <TouchableOpacity
        ref={selectRef as any}
        style={[
          styles.select,
          {
            borderColor: error
              ? theme.colors.error
              : isFocused
                ? theme.colors.yellow
                : theme.colors.white,
          },
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <UIText
          color={selectedOption ? "black" : "slateDark"}
          size="medium"
          align="left"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </UIText>
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsOpen(false);
          setIsFocused(false);
        }}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
        >
          <View
            style={[
              styles.modalContent,
              {
                position: "absolute",
                top: selectPosition.y + selectPosition.height + 4,
                left: selectPosition.x,
                width: selectPosition.width,
              },
            ]}
          >
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setIsFocused(false);
                  }}
                >
                  <UIText
                    color={value === option.value ? "black" : "slateDark"}
                    size="medium"
                    align="left"
                  >
                    {option.label}
                  </UIText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
      {error && (
        <UIText
          size="small"
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
    </UIView.Animated>
  );
}

const styles = StyleSheet.create({
  select: {
    marginVertical: 4,
    minHeight: 42,
    width: "100%",
    borderWidth: 2,
    borderRadius: theme.border.radius.xlarge,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    // Position will be set dynamically
  },
  optionsContainer: {
    borderRadius: theme.border.radius.large,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    overflow: "hidden",
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.slateDark + "20",
  },
  selectedOption: {
    backgroundColor: theme.colors.yellowLight,
  },
});
