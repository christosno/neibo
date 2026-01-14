export const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    slateLight: "#94a3b8",
    slate: "#1e293b",
    slateDark: "#0f172a",
    yellow: "#fde047",
    yellowLight: "#fef9c3",
    error: "#ef4444",
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 24,
    xLarge: 40,
  },
  fontWeights: {
    normal: "400",
    bold: "800",
  },
  fonts: {
    main: "System",
  },
  spacing: {
    tiny: 4,
    small: 8,
    medium: 12,
    large: 22,
    xLarge: 42,
  },
  fontFamily: {
    caveat: "Caveat_400Regular",
  },
  shadows: {
    card: "",
    bottomSheet: "",
    toast: "",
    input: "",
  },
  border: {
    width: {
      small: 1,
      medium: 2,
      large: 5,
    },
    radius: {
      xxsmall: 1,
      xsmall: 3,
      small: 5,
      medium: 10,
      large: 15,
      xlarge: 20,
      xxlarge: 30,
    },
  },
};

export type UIThemeColor = keyof typeof theme.colors;
export type UIThemeFontSize = keyof typeof theme.fontSizes;
export type UIThemeFontWeight = keyof typeof theme.fontWeights;
export type UIThemeSpacing = keyof typeof theme.spacing;
export type UIThemeShadow = keyof typeof theme.shadows;
export type UIThemeBorderWidth = keyof typeof theme.border.width;
export type UIThemeBorderRadius = keyof typeof theme.border.radius;
export type UIThemeBorder = `${UIThemeColor}.${UIThemeBorderWidth}`;
