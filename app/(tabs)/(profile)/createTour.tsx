import { useState } from "react";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateTourForm,
  type SpotFormData,
  type CreateTourFormData,
} from "@/hooks/create-tour/useCreateTourForm";
import { useCreateTour } from "@/hooks/create-tour/useCreateTour";
import { WizardStep, STEPS } from "@/components/CreateTour/types";
import { InfoStep } from "@/components/CreateTour/InfoStep";
import { SpotsStep } from "@/components/CreateTour/SpotsStep";
import { SummaryStep } from "@/components/CreateTour/SummaryStep";

export default function CreateTour() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<WizardStep>("info");
  const [invalidSteps, setInvalidSteps] = useState<WizardStep[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useCreateTourForm();

  const { createTour, isPending, error } = useCreateTour();

  const spots = watch("spots");
  const formValues = watch();

  // Spot handlers
  const handleAddSpot = (spotData: Omit<SpotFormData, "positionOrder">) => {
    const newSpot: SpotFormData = {
      ...spotData,
      positionOrder: spots.length,
    };
    setValue("spots", [...spots, newSpot]);
  };

  const handleRemoveSpot = (index: number) => {
    const updatedSpots = spots
      .filter((_, i) => i !== index)
      .map((spot, i) => ({ ...spot, positionOrder: i }));
    setValue("spots", updatedSpots);
  };

  // Navigation handlers
  const handleNextToSpots = async () => {
    const isValid = await trigger(["name", "description"], {
      shouldFocus: true,
    });
    if (isValid) {
      clearInvalidStep("info");
      setStep("spots");
    }
  };

  const handleNextToSummary = () => {
    if (spots.length > 0) {
      clearInvalidStep("spots");
      setStep("summary");
    }
  };

  const handleStepPress = async (targetStep: WizardStep) => {
    const targetIndex = STEPS.findIndex((s) => s.key === targetStep);
    const newInvalidSteps: WizardStep[] = [];

    // Validate all steps before the target step
    for (let i = 0; i < targetIndex; i++) {
      const stepKey = STEPS[i].key;

      if (stepKey === "info") {
        const isValid = await trigger(["name", "description"]);
        if (!isValid) {
          newInvalidSteps.push("info");
        }
      } else if (stepKey === "spots") {
        if (spots.length === 0) {
          newInvalidSteps.push("spots");
        }
      }
    }

    setInvalidSteps(newInvalidSteps);
    setStep(targetStep);
  };

  const clearInvalidStep = (stepKey: WizardStep) => {
    setInvalidSteps((prev) => prev.filter((s) => s !== stepKey));
  };

  // Submit handler
  const onSubmit = async (formData: CreateTourFormData) => {
    if (formData.spots.length === 0) {
      return;
    }

    try {
      await createTour(formData);
      // Clear all form state
      reset();
      setStep("info");
      setInvalidSteps([]);
      queryClient.invalidateQueries({ queryKey: ["walks"] });
      // First go back to profile index to clear the stack
      router.back();
      // Then navigate to home
      router.navigate("/(tabs)/(home)");
    } catch (err) {
      console.log("Create tour error:", err);
    }
  };

  // Render step
  if (step === "info") {
    return (
      <InfoStep
        control={control}
        errors={errors}
        currentStep={step}
        invalidSteps={invalidSteps}
        onStepPress={handleStepPress}
        onNext={handleNextToSpots}
      />
    );
  }

  if (step === "spots") {
    return (
      <SpotsStep
        spots={spots}
        currentStep={step}
        invalidSteps={invalidSteps}
        onStepPress={handleStepPress}
        onAddSpot={handleAddSpot}
        onRemoveSpot={handleRemoveSpot}
        onNext={handleNextToSummary}
      />
    );
  }

  return (
    <SummaryStep
      formValues={formValues}
      spots={spots}
      currentStep={step}
      invalidSteps={invalidSteps}
      isPending={isPending}
      error={error}
      onStepPress={handleStepPress}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
