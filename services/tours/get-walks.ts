import { http } from "../http/http";

export type Walk = {
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

export type GetWalksResponse = {
  message: string;
  data: {
    walks: Walk[];
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

export const isGetWalksResponse = (
  input: unknown
): input is GetWalksResponse => {
  if (typeof input !== "object" || input === null) return false;
  const response = input as GetWalksResponse;
  return (
    typeof response.message === "string" &&
    typeof response.data === "object" &&
    Array.isArray(response.data?.walks)
  );
};

type GetWalksParams = {
  page?: number;
  limit?: number;
};

export const getWalks = (params?: GetWalksParams) => {
  return http.basic<GetWalksResponse>({
    url: "/walks",
    method: "GET",
    params,
    validator: isGetWalksResponse,
  });
};
