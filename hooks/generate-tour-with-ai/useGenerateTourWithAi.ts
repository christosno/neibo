import { useMutation } from "@tanstack/react-query";
import { generateAiTour } from "./generate-ai-tour";
import { TourFormData } from "@/app/(tabs)/(home)/useTourForm";

export const useGenerateTourWithAi = () => {
  const result = useMutation({
    mutationKey: ["generate-tour-with-ai"],
    mutationFn: (body: TourFormData) => generateAiTour(body),
    onError: (error) => {
      console.log("🚀 ~ error:", error);
    },
    onSuccess: (data) => {
      console.log("🚀 ~ data:", data);
    },
  });

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    generateTour: result.mutate,
  };
};
