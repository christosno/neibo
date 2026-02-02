import { http } from "../http/http";

export type ReviewUser = {
  id: string;
  username: string;
  profilePicture: string | null;
};

export type Review = {
  id: string;
  walkId: string;
  userId: string;
  stars: number;
  textReview: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
};

export type ReviewPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  next: string | null;
  previous: string | null;
};

export type GetReviewsResponse = {
  message: string;
  data: {
    reviews: Review[];
    pagination: ReviewPagination;
  };
};

export const isGetReviewsResponse = (
  input: unknown
): input is GetReviewsResponse => {
  if (typeof input !== "object" || input === null) return false;
  const response = input as GetReviewsResponse;
  return (
    typeof response.message === "string" &&
    typeof response.data === "object" &&
    Array.isArray(response.data?.reviews)
  );
};

type GetReviewsParams = {
  page?: number;
  limit?: number;
};

export const getReviews = (walkId: string, params?: GetReviewsParams) => {
  return http.basic<GetReviewsResponse>({
    url: `/walks/${walkId}/reviews`,
    method: "GET",
    params,
    validator: isGetReviewsResponse,
  });
};
