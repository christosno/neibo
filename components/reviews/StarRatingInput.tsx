import { Pressable, StyleSheet } from "react-native";
import { UIView } from "@/ui-kit/layout/UIView";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";

type StarRatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
};

export function StarRatingInput({
  value,
  onChange,
  size = 32,
}: StarRatingInputProps) {
  return (
    <UIView row gap="small">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= value ? "star" : "star-outline"}
            size={size}
            color={star <= value ? theme.colors.yellow : theme.colors.slateLight}
          />
        </Pressable>
      ))}
    </UIView>
  );
}

const styles = StyleSheet.create({
  starButton: {
    padding: 4,
  },
});
