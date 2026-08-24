import { useMemo } from 'react';

import type {
  Concept,
  ConceptListParams,
  ConceptListResponse,
} from '@/models/topics/topics-model';
import { useGetConceptsQuery } from '@/services/topics/topics-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseTopicsResult {
  data: ConceptListResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function filterConcepts(
  concepts: Concept[],
  params: ConceptListParams,
): Concept[] {
  const search = (params.search ?? '').trim().toLowerCase();
  const status = params.status;

  return concepts.filter((concept) => {
    const matchesStatus =
      !status || status === 'all' || concept.status === status;
    const matchesSearch =
      search.length === 0 ||
      concept.title.toLowerCase().includes(search) ||
      concept.category.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });
}

export default function useTopics(params: ConceptListParams): UseTopicsResult {
  const { data, isLoading, isError, error, refetch } = useGetConceptsQuery();

  const filtered = useMemo((): ConceptListResponse | null => {
    if (!data) {
      return null;
    }

    const concepts = filterConcepts(data.concepts, params);

    return {
      concepts,
      total: data.total,
    };
  }, [data, params.search, params.status]);

  return {
    data: filtered,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
