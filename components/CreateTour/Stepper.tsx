import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { UIView } from "@/ui-kit/layout/UIView";
import { UIText } from "@/ui-kit/typography/UIText";
import { theme } from "@/theme";
import { WizardStep, STEPS } from "./types";

type StepperProps = {
  currentStep: WizardStep;
  onStepPress: (step: WizardStep) => void;
  invalidSteps: WizardStep[];
};

export function Stepper({
  currentStep,
  onStepPress,
  invalidSteps,
}: StepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <UIView
      row
      mainAxis="center"
      crossAxis="center"
      padding="medium"
      gap="small"
    >
      {STEPS.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentIndex;
        const hasError = invalidSteps.includes(step.key);

        const getCircleStyle = () => {
          if (hasError) return styles.stepCircleError;
          if (isActive) return styles.stepCircleActive;
          if (isCompleted) return styles.stepCircleCompleted;
          return null;
        };

        const renderStepContent = () => {
          if (hasError) {
            return (
              <Ionicons name="help" size={16} color={theme.colors.white} />
            );
          }
          if (isCompleted) {
            return (
              <Ionicons
                name="checkmark"
                size={14}
                color={theme.colors.slateDark}
              />
            );
          }
          return (
            <UIText
              size="small"
              color={isActive ? "slateDark" : "slateLight"}
              style={styles.stepNumber}
            >
              {index + 1}
            </UIText>
          );
        };

        const getLabelColor = () => {
          if (hasError) return "error";
          if (isActive) return "yellow";
          return "slateLight";
        };

        return (
          <UIView key={step.key} row crossAxis="center">
            <Pressable
              onPress={() => onStepPress(step.key)}
              style={styles.stepContainer}
            >
              <UIView
                style={[styles.stepCircle, getCircleStyle()]}
                mainAxis="center"
                crossAxis="center"
              >
                {renderStepContent()}
              </UIView>
              <UIText
                size="small"
                color={getLabelColor()}
                style={[styles.stepLabel, isActive && styles.stepLabelActive]}
              >
                {step.label}
              </UIText>
            </Pressable>
            {index < STEPS.length - 1 && (
              <UIView
                style={[
                  styles.stepConnector,
                  isCompleted && !hasError && styles.stepConnectorCompleted,
                  hasError && styles.stepConnectorError,
                ]}
              />
            )}
          </UIView>
        );
      })}
    </UIView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.small,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.slate,
    borderWidth: 2,
    borderColor: theme.colors.slateLight,
  },
  stepCircleActive: {
    backgroundColor: theme.colors.yellow,
    borderColor: theme.colors.yellow,
  },
  stepCircleCompleted: {
    backgroundColor: theme.colors.yellow,
    borderColor: theme.colors.yellow,
  },
  stepCircleError: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  stepNumber: {
    fontWeight: "600",
  },
  stepLabel: {
    marginTop: 4,
  },
  stepLabelActive: {
    fontWeight: "600",
  },
  stepConnector: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.slate,
    marginBottom: 18,
  },
  stepConnectorCompleted: {
    backgroundColor: theme.colors.yellow,
  },
  stepConnectorError: {
    backgroundColor: theme.colors.error,
  },
});
