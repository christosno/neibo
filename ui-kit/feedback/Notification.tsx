import { UIView } from "../layout/UIView";
import { UIText } from "../typography/UIText";

type NotificationProps = {
  title: string;
  message: string;
  type: "success" | "error" | "info";
};

export function Notification({ title, message, type }: NotificationProps) {
  return (
    <UIView
      gap="medium"
      padding="medium"
      borderRadius="xlarge"
      border={
        type === "error"
          ? "red.medium"
          : type === "success"
            ? "green.medium"
            : "orange.medium"
      }
      expanded
      color={
        type === "success"
          ? "greenLight"
          : type === "error"
            ? "redLight"
            : "orangeLight"
      }
    >
      <UIText
        color={
          type === "success" ? "green" : type === "error" ? "red" : "orange"
        }
      >
        {title}
      </UIText>
      <UIText
        size="small"
        color={
          type === "success" ? "green" : type === "error" ? "red" : "orange"
        }
      >
        {message}
      </UIText>
    </UIView>
  );
}
