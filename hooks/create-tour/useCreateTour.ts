import { useMutation } from "@tanstack/react-query";
import { createTour } from "@/services/tours/create-tour";
import type { CreateTourFormData } from "./useCreateTourForm";

export const useCreateTour = () => {
  const result = useMutation({
    mutationKey: ["create-tour"],
    mutationFn: (body: CreateTourFormData) => createTour(body),
    onError: (error) => {
      console.log("Create tour error:", error);
    },
  });

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    createTour: result.mutateAsync,
  };
};
