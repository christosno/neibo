import { http } from "../http/http";
import type { CreateTourFormData } from "@/hooks/create-tour/useCreateTourForm";

export type CreateTourResponse = {
  message: string;
  walk: {
    id: string;
    name: string;
    description?: string;
    coverImageUrl?: string;
    duration_estimate?: number;
    distance_estimate?: number;
    isPublic?: boolean;
  };
  spots: {
    id: string;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    reach_radius?: number;
    positionOrder: number;
    imageUrls?: string[];
  }[];
};

export const isCreateTourResponse = (
  input: unknown
): input is CreateTourResponse => {
  if (typeof input !== "object" || input === null) return false;
  const response = input as CreateTourResponse;
  return (
    typeof response.message === "string" &&
    typeof response.walk === "object" &&
    response.walk !== null
  );
};

const cleanFormData = (body: CreateTourFormData) => {
  // Clean up spots - remove empty optional fields
  const cleanedSpots = body.spots.map((spot) => ({
    title: spot.title,
    latitude: spot.latitude,
    longitude: spot.longitude,
    positionOrder: spot.positionOrder,
    ...(spot.description ? { description: spot.description } : {}),
    ...(spot.reach_radius !== undefined ? { reach_radius: spot.reach_radius } : {}),
    ...(spot.imageUrls && spot.imageUrls.length > 0 ? { imageUrls: spot.imageUrls } : {}),
  }));

  return {
    name: body.name,
    spots: cleanedSpots,
    ...(body.description ? { description: body.description } : {}),
    ...(body.coverImageUrl ? { coverImageUrl: body.coverImageUrl } : {}),
    ...(body.duration_estimate !== undefined ? { duration_estimate: body.duration_estimate } : {}),
    ...(body.distance_estimate !== undefined ? { distance_estimate: body.distance_estimate } : {}),
    ...(body.isPublic !== undefined ? { isPublic: body.isPublic } : {}),
    // Skip tagIds for now - backend expects UUIDs, not tag names
    // TODO: Fetch tags from API and use their IDs
  };
};

export const createTour = (body: CreateTourFormData) => {
  const cleanedData = cleanFormData(body);
  console.log("Sending cleaned data:", JSON.stringify(cleanedData, null, 2));

  return http.auth({
    url: "/walks",
    method: "POST",
    data: cleanedData,
    validator: isCreateTourResponse,
  });
};
