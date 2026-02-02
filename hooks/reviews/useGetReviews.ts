import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviews, type Review } from "@/services/reviews/get-reviews";

export const useGetReviews = (walkId: string | undefined) => {
  const result = useInfiniteQuery({
    queryKey: ["reviews", walkId],
    queryFn: ({ pageParam }) =>
      getReviews(walkId!, { page: pageParam, limit: 5 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasNext) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!walkId,
  });

  const reviews: Review[] =
    result.data?.pages.flatMap((page) => page.data.reviews) ?? [];

  const totalReviews = result.data?.pages[0]?.data.pagination.total ?? 0;

  return {
    reviews,
    totalReviews,
    isLoading: result.isLoading,
    isFetchingNextPage: result.isFetchingNextPage,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
  };
};
