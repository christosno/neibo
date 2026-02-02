import { http } from "../http/http";

export type TourSpot = {
  id: string;
  tourId: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  reach_radius: number;
  positionOrder: number;
  imageUrls: string[];
  audioUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type TourAuthor = {
  id: string;
  username: string;
  profilePicture: string;
};

export type TourDetail = {
  id: string;
  authorId: string;
  name: string;
  description: string;
  coverImageUrl: string;
  duration_estimate: string;
  distance_estimate: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  spots: TourSpot[];
  author: TourAuthor;
  walkTags: string[];
  avgStars: number | null;
};

type GetTourByIdResponse = {
  message: string;
  data: TourDetail;
};

const isGetTourByIdResponse = (
  input: unknown,
): input is GetTourByIdResponse => {
  if (!input || typeof input !== "object") return false;
  const response = input as GetTourByIdResponse;
  return (
    typeof response.message === "string" &&
    response.data !== null &&
    typeof response.data === "object" &&
    typeof response.data.id === "string" &&
    Array.isArray(response.data.spots)
  );
};

export const getTourById = (id: string) => {
  return http.basic<GetTourByIdResponse>({
    url: `/walks/${id}`,
    method: "GET",
    validator: isGetTourByIdResponse,
  });
};
