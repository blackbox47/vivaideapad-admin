import { useMemo } from 'react';

import type {
  CreatorTopic,
  CreatorTopicsResponse,
  OpportunityCategoryFilter,
} from '@/models/creator/submit-idea-model';
import { useGetCreatorTopicsQuery } from '@/services/creator/creator-ideas-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseCreatorTopicsParams {
  category?: OpportunityCategoryFilter;
  search?: string;
}

interface UseCreatorTopicsResult {
  data: CreatorTopicsResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function filterTopics(
  topics: CreatorTopic[],
  params: UseCreatorTopicsParams,
): CreatorTopic[] {
  const search = (params.search ?? '').trim().toLowerCase();
  const category = params.category;

  return topics.filter((topic) => {
    const matchesCategory =
      !category || category === 'All' || topic.category === category;
    const matchesSearch =
      search.length === 0 ||
      topic.title.toLowerCase().includes(search) ||
      topic.category.toLowerCase().includes(search) ||
      topic.description.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });
}

export default function useCreatorTopics(
  params: UseCreatorTopicsParams = {},
): UseCreatorTopicsResult {
  const { data, isLoading, isError, error, refetch } = useGetCreatorTopicsQuery();

  const filtered = useMemo((): CreatorTopicsResponse | null => {
    if (!data) {
      return null;
    }

    return {
      topics: filterTopics(data.topics, params),
    };
  }, [data, params.category, params.search]);

  return {
    data: filtered,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
