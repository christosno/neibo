import { http } from "../http/http";

export type Tour = {
  id: string;
  authorId: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  duration_estimate?: number | string | null;
  distance_estimate?: number | string | null;
  isPublic?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type GetToursResponse = {
  message: string;
  data: {
    walks: Tour[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
      next: string | null;
      previous: string | null;
    };
  };
};

export const isGetToursResponse = (
  input: unknown
): input is GetToursResponse => {
  if (typeof input !== "object" || input === null) return false;
  const response = input as GetToursResponse;
  return (
    typeof response.message === "string" &&
    typeof response.data === "object" &&
    Array.isArray(response.data?.walks)
  );
};

type GetToursParams = {
  page?: number;
  limit?: number;
};

export const getTours = (params?: GetToursParams) => {
  return http.basic<GetToursResponse>({
    url: "/walks",
    method: "GET",
    params,
    validator: isGetToursResponse,
  });
};
