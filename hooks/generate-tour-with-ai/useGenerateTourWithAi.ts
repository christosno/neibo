import { useMutation } from "@tanstack/react-query";
import { generateAiTour } from "./generate-ai-tour";
import { TourFormData } from "@/app/(tabs)/(home)/useTourForm";
import { useAiTourStore } from "../useAiTourStore";

export const useGenerateTourWithAi = () => {
  const setTourData = useAiTourStore((state) => state.setTourData);

  const result = useMutation({
    mutationKey: ["generate-tour-with-ai"],
    mutationFn: (body: TourFormData) => generateAiTour(body),
    onError: (error) => {
      console.log("👉 ~ useGenerateTourWithAi ~ error:", error);
    },
    onMutate: (body) => {
      setTourData(null);
    },
    onSuccess: (data) => {
      setTourData(data);
    },
  });

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    generateTour: result.mutateAsync,
  };
};
