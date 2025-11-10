import { Image, useWindowDimensions } from "react-native";

export function PlantlyImage({ size }: { size?: number }) {
  const { width } = useWindowDimensions();

  const imageSize = size || width / 1.5;
  return (
    <Image
      source={require("@/assets/plantly.png")}
      style={{
        width: imageSize,
        height: imageSize,
      }}
    />
  );
}
