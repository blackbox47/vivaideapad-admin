import { useMemo } from 'react';

import type {
  Concept,
  ConceptCategory,
  ConceptListParams,
  ConceptListResponse,
} from '@/models/topics/topics-model';
import { useGetConceptsQuery } from '@/services/topics/topics-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseTopicsResult {
  data: ConceptListResponse | null;
  categories: ConceptCategory[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

function filterConcepts(
  concepts: Concept[] | undefined,
  params: ConceptListParams,
): Concept[] {
  if (!Array.isArray(concepts)) {
    return [];
  }

  const search = (params.search ?? '').trim().toLowerCase();
  const status = params.status;

  return concepts.filter((concept) => {
    const matchesStatus =
      !status || status === 'all' || concept.status === status;
    const matchesSearch =
      search.length === 0 ||
      concept.title?.toLowerCase().includes(search) ||
      concept.category?.toLowerCase().includes(search);

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
      total: data.total ?? concepts.length,
    };
  }, [data, params.search, params.status]);

  const categories = useMemo((): ConceptCategory[] => {
    if (!data || !Array.isArray(data.concepts)) {
      return [];
    }

    const seen = new Map<string, string>();
    for (const concept of data.concepts) {
      if (concept?.category) {
        if (!seen.has(concept.category)) {
          seen.set(concept.category, concept.icon || '✦');
        }
      }
    }

    return [...seen.entries()].map(([name, icon]) => ({ name, icon }));
  }, [data]);

  return {
    data: filtered,
    categories,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
