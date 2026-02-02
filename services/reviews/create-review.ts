import { http } from "../http/http";
import type { Review } from "./get-reviews";

export type CreateReviewBody = {
  stars: number;
  textReview?: string;
};

export type CreateReviewResponse = {
  message: string;
  data: Review;
};

export const isCreateReviewResponse = (
  input: unknown
): input is CreateReviewResponse => {
  if (typeof input !== "object" || input === null) return false;
  const response = input as CreateReviewResponse;
  return (
    typeof response.message === "string" &&
    typeof response.data === "object" &&
    typeof response.data?.id === "string"
  );
};

export const createReview = (walkId: string, body: CreateReviewBody) => {
  return http.auth<CreateReviewResponse>({
    url: `/walks/${walkId}/reviews`,
    method: "POST",
    data: body,
    validator: isCreateReviewResponse,
  });
};
