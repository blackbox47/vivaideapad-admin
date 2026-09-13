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
      !status ||
      status === 'all' ||
      (status === 'new'
        ? Boolean(concept.isOnboarding)
        : concept.status === status);
    const matchesSearch =
      search.length === 0 ||
      concept.title?.toLowerCase().includes(search) ||
      concept.category?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });
}

export default function useTopics(params: ConceptListParams): UseTopicsResult {
  const { data, isLoading, isError, error, refetch } = useGetConceptsQuery({
    status: params.status,
    search: params.search,
    category_id: params.category_id,
    page: params.page,
    limit: params.limit ?? 100,
  });

  const filtered = useMemo((): ConceptListResponse | null => {
    if (!data) {
      return null;
    }

    // Keep client-side filtering as a safety net (esp. search by category label).
    const concepts = filterConcepts(data.concepts, params);

    return {
      concepts,
      total: concepts.length,
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
