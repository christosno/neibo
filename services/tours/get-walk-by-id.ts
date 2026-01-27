import { http } from "../http/http";

export type WalkSpot = {
  id: string;
  walkId: string;
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

export type WalkAuthor = {
  id: string;
  username: string;
  profilePicture: string;
};

export type WalkDetail = {
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
  spots: WalkSpot[];
  author: WalkAuthor;
  walkTags: string[];
};

type GetWalkByIdResponse = {
  message: string;
  data: WalkDetail;
};

const isGetWalkByIdResponse = (input: unknown): input is GetWalkByIdResponse => {
  if (!input || typeof input !== "object") return false;
  const response = input as GetWalkByIdResponse;
  return (
    typeof response.message === "string" &&
    response.data !== null &&
    typeof response.data === "object" &&
    typeof response.data.id === "string" &&
    Array.isArray(response.data.spots)
  );
};

export const getWalkById = (id: string) => {
  return http.basic<GetWalkByIdResponse>({
    url: `/walks/${id}`,
    method: "GET",
    validator: isGetWalkByIdResponse,
  });
};
