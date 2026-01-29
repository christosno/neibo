import { useRef } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/theme";
import Constants from "expo-constants";

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra
  ?.GOOGLE_MAPS_API_KEY as string | undefined;

type AddressSearchInputProps = {
  onPlaceSelected: (place: {
    latitude: number;
    longitude: number;
    description: string;
  }) => void;
};

export function AddressSearchInput({
  onPlaceSelected,
}: AddressSearchInputProps) {
  const ref = useRef<any>(null);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search for an address"
        fetchDetails={true}
        minLength={2}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            onPlaceSelected({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              description: data.description,
            });
            ref.current?.setAddressText("");
            Keyboard.dismiss();
          }
        }}
        onFail={(error) => console.error("🔍 → Places API error:", error)}
        onNotFound={() => console.log("🔍 → No results found")}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        renderLeftButton={() => (
          <View style={styles.iconContainer}>
            <Ionicons name="search" size={18} color={theme.colors.slateLight} />
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        listViewDisplayed="auto"
        styles={{
          container: styles.autocompleteContainer,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          separator: styles.separator,
          poweredContainer: styles.poweredContainer,
        }}
        enablePoweredByContainer={false}
        debounce={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInputContainer: {
    backgroundColor: "transparent",
  },
  textInput: {
    height: 42,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    borderRadius: theme.border.radius.xlarge,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.slateDark,
  },
  iconContainer: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 1,
  },
  listView: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.border.radius.medium,
    marginTop: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    backgroundColor: theme.colors.white,
    padding: 12,
  },
  description: {
    color: theme.colors.slateDark,
    fontSize: theme.fontSizes.medium,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.slateLight,
    opacity: 0.3,
  },
  poweredContainer: {
    display: "none",
  },
});
