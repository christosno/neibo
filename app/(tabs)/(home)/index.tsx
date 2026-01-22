import { UIButton } from "@/ui-kit/buttons/UIButton";
import { UIView } from "@/ui-kit/layout/UIView";
import { router } from "expo-router";

export default function Home() {
  return (
    <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
      <UIButton
        variant="outlined"
        onPress={() => router.push("/ai-tour")}
      >
        Create a Tour with AI
      </UIButton>
    </UIView>
  );
}
