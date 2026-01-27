import { useInfiniteQuery } from "@tanstack/react-query";
import { getWalks, type Walk } from "@/services/tours/get-walks";

type UseGetWalksParams = {
  limit?: number;
};

export const useGetWalks = () => {

  const result = useInfiniteQuery({
    queryKey: ["walks"],
    queryFn: ({ pageParam }) => getWalks({ page: pageParam, limit: 10 }),
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
