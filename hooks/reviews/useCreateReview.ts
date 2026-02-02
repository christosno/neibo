import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  type CreateReviewBody,
} from "@/services/reviews/create-review";

export const useCreateReview = (walkId: string | undefined) => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationKey: ["create-review", walkId],
    mutationFn: (body: CreateReviewBody) => createReview(walkId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", walkId] });
      queryClient.invalidateQueries({ queryKey: ["tour", walkId] });
    },
    onError: (error: any) => {
      console.log("Create review error:", error);
      console.log("Response data:", error?.response?.data);
      console.log("Response status:", error?.response?.status);
    },
  });

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    isSuccess: result.isSuccess,
    error: result.error,
    createReview: result.mutateAsync,
    reset: result.reset,
  };
};
