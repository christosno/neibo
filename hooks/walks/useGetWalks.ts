import { useInfiniteQuery } from "@tanstack/react-query";
import { getWalks, type Walk } from "@/services/tours/get-walks";

type UseGetWalksParams = {
  limit?: number;
};

export const useGetWalks = (params?: UseGetWalksParams) => {
  const limit = params?.limit ?? 10;

  const result = useInfiniteQuery({
    queryKey: ["walks", limit],
    queryFn: ({ pageParam }) => getWalks({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNext) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
  });

  const walks: Walk[] =
    result.data?.pages.flatMap((page) => page.data.walks) ?? [];

  return {
    walks,
    isLoading: result.isLoading,
    isFetchingNextPage: result.isFetchingNextPage,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
  };
};
