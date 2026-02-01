import { StyleSheet, Image } from "react-native";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import type { Tour } from "@/services/tours/get-tours";

type TripCardProps = {
  tour: Tour;
  onPress?: () => void;
};

export function TripCard({ tour, onPress }: TripCardProps) {
  const formatDuration = (minutes?: number | string) => {
    if (minutes === undefined || minutes === null) return null;
    const mins = typeof minutes === "string" ? parseFloat(minutes) : minutes;
    if (isNaN(mins) || mins <= 0) return null;
    if (mins < 60) return `${Math.round(mins)} min`;
    const hours = Math.floor(mins / 60);
    const remainder = Math.round(mins % 60);
    return remainder > 0 ? `${hours}h ${remainder}min` : `${hours}h`;
  };

  const formatDistance = (km?: number | string) => {
    if (km === undefined || km === null) return null;
    const distance = typeof km === "string" ? parseFloat(km) : km;
    if (isNaN(distance) || distance <= 0) return null;
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  return (
    <UIView.Pressable onPress={onPress} style={styles.container}>
      <UIView color="slate" borderRadius="large" style={styles.card}>
        {tour.coverImageUrl && tour.coverImageUrl.length > 0 ? (
          <Image
            source={{ uri: tour.coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <UIView style={styles.placeholderImage} color="slateDark">
            <Ionicons
              name="map-outline"
              size={40}
              color={theme.colors.slateLight}
            />
          </UIView>
        )}

        <UIView padding="medium" gap="small">
          <UIText size="medium" color="yellow" align="left" numberOfLines={1}>
            {tour.name}
          </UIText>

          {tour.description && (
            <UIText
              size="small"
              color="slateLight"
              align="left"
              numberOfLines={2}
            >
              {tour.description}
            </UIText>
          )}

          <UIView row gap="medium" style={styles.metaContainer}>
            {tour.duration_estimate && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {formatDuration(tour.duration_estimate)}
                </UIText>
              </UIView>
            )}

            {tour.distance_estimate && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name="walk-outline"
                  size={14}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {formatDistance(tour.distance_estimate)}
                </UIText>
              </UIView>
            )}

            {tour.isPublic !== undefined && tour.isPublic !== null && (
              <UIView row crossAxis="center" gap="tiny">
                <Ionicons
                  name={tour.isPublic ? "globe-outline" : "lock-closed-outline"}
                  size={14}
                  color={theme.colors.slateLight}
                />
                <UIText size="small" color="slateLight">
                  {tour.isPublic ? "Public" : "Private"}
                </UIText>
              </UIView>
            )}
          </UIView>
        </UIView>
      </UIView>
    </UIView.Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  card: {
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 150,
  },
  placeholderImage: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  metaContainer: {
    flexWrap: "wrap",
  },
});
