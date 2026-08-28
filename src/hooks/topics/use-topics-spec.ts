import { useCallback } from 'react';

import type {
  ConceptDetail,
  TransitionConceptStatusBody,
  UpdateConceptBody,
} from '@/models/topics/topics-model';
import {
  useDeleteConceptMutation,
  useTransitionConceptStatusMutation,
  useUpdateConceptMutation,
} from '@/services/topics/topics-service';

interface UseTopicMutationsResult {
  updateConcept: (
    id: string,
    body: UpdateConceptBody,
  ) => Promise<boolean>;
  transitionStatus: (
    id: string,
    body: TransitionConceptStatusBody,
  ) => Promise<boolean>;
  deleteConcept: (id: string) => Promise<boolean>;
  fetchConcept: (id: string) => Promise<ConceptDetail | null>;
  isUpdating: boolean;
  isTransitioning: boolean;
  isDeleting: boolean;
}

export default function useTopicMutations(): UseTopicMutationsResult {
  const [triggerUpdate, updateState] = useUpdateConceptMutation();
  const [triggerTransition, transitionState] =
    useTransitionConceptStatusMutation();
  const [triggerDelete, deleteState] = useDeleteConceptMutation();
  // Stub fetcher — use `useGetConceptQuery(id)` from the service for real
  // fetches.
  const _fetchConcept = useCallback(async (_id: string) => null, []);

  const updateConcept = useCallback(
    async (id: string, body: UpdateConceptBody) => {
      try {
        await triggerUpdate({ id, body }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerUpdate],
  );

  const transitionStatus = useCallback(
    async (id: string, body: TransitionConceptStatusBody) => {
      try {
        await triggerTransition({ id, body }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerTransition],
  );

  const deleteConcept = useCallback(
    async (id: string) => {
      try {
        await triggerDelete(id).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [triggerDelete],
  );

  return {
    updateConcept,
    transitionStatus,
    deleteConcept,
    fetchConcept: _fetchConcept,
    isUpdating: updateState.isLoading,
    isTransitioning: transitionState.isLoading,
    isDeleting: deleteState.isLoading,
  };
}
