import { useAiTourStore } from "@/hooks/useAiTourStore";
import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { Notification } from "@/ui-kit/feedback/Notification";

export default function Trip() {
  const tourData = useAiTourStore((state) => state.tourData);

  if (!tourData) {
    return (
      <UIView expanded color="slateDark" mainAxis="center" crossAxis="center">
        <Notification
          title="Error"
          message="Not able to generate tour"
          type="error"
        />
      </UIView>
    );
  }

  return (
    <UIView expanded color="slateDark" gap="small" padding="small">
      <UIView row gap="small" mainAxis="flex-start" crossAxis="flex-start">
        <UIText color="slateLight">Name: </UIText>
        <UIText color="slateLight">{tourData?.name}</UIText>
      </UIView>
      <UIView row gap="small" mainAxis="flex-start" crossAxis="flex-start">
        <UIText color="slateLight">Description: </UIText>
        <UIText
          color="slateLight"
          align="left"
          expanded
          style={{ flexShrink: 1 }}
        >
          {tourData?.description}
        </UIText>
      </UIView>
      <UIView row gap="small" mainAxis="flex-start" crossAxis="flex-start">
        <UIText color="slateLight">Duration: </UIText>
        <UIText color="slateLight">{tourData?.duration_estimate}</UIText>
      </UIView>
      <UIView row gap="small" mainAxis="flex-start" crossAxis="flex-start">
        <UIText color="slateLight">Distance: </UIText>
        <UIText color="slateLight">{tourData?.distance_estimate}</UIText>
      </UIView>
    </UIView>
  );
}
