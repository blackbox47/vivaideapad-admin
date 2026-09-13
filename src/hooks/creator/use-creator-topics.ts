import { useCallback, useMemo, useState } from 'react';

import type {
  CreatorTopic,
  CreatorTopicsResponse,
  OpportunityCategoryFilter,
} from '@/models/creator/submit-idea-model';
import { useGetCreatorTopicsQuery } from '@/services/creator/creator-ideas-service';
import { DEFAULT_PAGE } from '@/utils/constants/pagination';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseCreatorTopicsParams {
  category?: OpportunityCategoryFilter;
  search?: string;
  /** Page size for API pagination. Omit to use the backend default. */
  limit?: number;
}

interface UseCreatorTopicsResult {
  data: CreatorTopicsResponse | null;
  total: number;
  hasMore: boolean;
  remainingCount: number;
  loadMore: () => void;
  isLoading: boolean;
  isFetchingMore: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function filterTopics(
  topics: CreatorTopic[] | undefined,
  params: UseCreatorTopicsParams,
): CreatorTopic[] {
  if (!Array.isArray(topics)) {
    return [];
  }

  const search = (params.search ?? '').trim().toLowerCase();
  const category = params.category;

  return topics.filter((topic) => {
    const matchesCategory =
      !category || category === 'All' || topic.category === category;
    const matchesSearch =
      search.length === 0 ||
      topic.title?.toLowerCase().includes(search) ||
      topic.category?.toLowerCase().includes(search) ||
      topic.description?.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });
}

export default function useCreatorTopics(
  params: UseCreatorTopicsParams = {},
): UseCreatorTopicsResult {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCreatorTopicsQuery({
      page,
      ...(params.limit != null ? { limit: params.limit } : {}),
    });

  const loadedTopics = data?.topics ?? [];
  const total = data?.total ?? loadedTopics.length;
  const hasMore = loadedTopics.length < total;
  const remainingCount = Math.max(0, total - loadedTopics.length);

  const filtered = useMemo((): CreatorTopicsResponse | null => {
    if (!data) {
      return null;
    }

    return {
      topics: filterTopics(data.topics, params),
      total: data.total,
      meta: data.meta,
    };
  }, [data, params.category, params.search]);

  return {
    data: filtered,
    total,
    hasMore,
    remainingCount,
    loadMore: useCallback(() => {
      setPage((current) => current + 1);
    }, []),
    isLoading,
    isFetchingMore: isFetching && !isLoading && page > DEFAULT_PAGE,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
