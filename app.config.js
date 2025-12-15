import "dotenv/config";

export default {
  expo: {
    name: "Neibo",
    slug: "neibo",
    scheme: "neibo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cnounis.neibo",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.cnounis.neibo",
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          fonts: [
            "node_modules/@expo-google-fonts/caveat/400Regular/Caveat_400Regular.ttf",
          ],
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-maps",
        {
          requestLocationPermission: true,
          locationPermission: "Allow $(PRODUCT_NAME) to use your location",
        },
      ],
    ],
    extra: {
      BASE_URL: process.env.BASE_URL || process.env.EXPO_PUBLIC_BASE_URL,
    },
  },
};
