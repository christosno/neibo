import { http } from "../http/http";
import { TourSpot } from "./get-tour-by-id";

export type TourTag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TourComment = {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type TourReview = {
  id: string;
  userId: string;
  stars: number;
  textReview: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserTour = {
  id: string;
  authorId: string;
  name: string;
  description: string;
  coverImageUrl: string;
  duration_estimate: string | null;
  distance_estimate: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  spots: TourSpot[];
  walkTags: TourTag[];
  walkComments: TourComment[];
  walkReviews: TourReview[];
};

type GetUserToursResponse = {
  message: string;
  data: UserTour[];
};

const isGetUserToursResponse = (
  input: unknown
): input is GetUserToursResponse => {
  if (!input || typeof input !== "object") return false;
  const response = input as GetUserToursResponse;
  return typeof response.message === "string" && Array.isArray(response.data);
};

export const getUserTours = () => {
  return http.auth<GetUserToursResponse>({
    url: `/users/walks`,
    method: "GET",
    validator: isGetUserToursResponse,
  });
};
