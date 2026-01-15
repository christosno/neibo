import { Modal, Pressable, StyleSheet } from "react-native";
import { UIView } from "../layout/UIView";
import { UIText } from "../typography/UIText";
import { Ionicons } from "@expo/vector-icons";
import type { GeocodedSpot } from "@/hooks/useGeocodeTourSpots";

type SpotDescriptionModalProps = {
  spot: GeocodedSpot | null;
  visible: boolean;
  onClose: () => void;
};

export function SpotDescriptionModal({
  spot,
  visible,
  onClose,
}: SpotDescriptionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {spot && (
            <UIView gap="medium" padding="large">
              <UIView row mainAxis="space-between" crossAxis="center">
                <UIText size="large" color="yellow" align="left" expanded>
                  {spot.title}
                </UIText>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </UIView>
              <UIText
                size="medium"
                color="slateLight"
                align="left"
                style={styles.descriptionText}
              >
                {spot.description}
              </UIText>
            </UIView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e293b", // slateDark equivalent
    borderRadius: 16,
    margin: 20,
    maxWidth: "90%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  descriptionText: {
    lineHeight: 22,
  },
});
