import { useCallback } from 'react';

import type {
  SubmissionDecisionBody,
  SubmissionDetail,
} from '@/models/content-review/content-review-model';
import {
  useDecideSubmissionSpecMutation,
  usePublishSubmissionMutation,
  useRiskScanSubmissionMutation,
} from '@/services/content-review/content-review-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseContentReviewSpecResult {
  fetchSubmission: (id: string) => Promise<SubmissionDetail | null>;
  decideSubmission: (
    id: string,
    body: SubmissionDecisionBody,
  ) => Promise<unknown>;
  publishSubmission: (id: string) => Promise<unknown>;
  scanRisk: (id: string) => Promise<unknown>;
  isDeciding: boolean;
  isPublishing: boolean;
  isScanning: boolean;
}

/**
 * Hook façade for the spec-aligned submissions endpoints (REST spec §5.5).
 *
 * For detail fetches, prefer the inline `useGetSubmissionQuery(id)` from the
 * service; this façade is for the four mutations.
 */
export default function useContentReviewSpec(): UseContentReviewSpecResult {
  const [decide, decideState] = useDecideSubmissionSpecMutation();
  const [publish, publishState] = usePublishSubmissionMutation();
  const [scan, scanState] = useRiskScanSubmissionMutation();
  // Stable no-op fetcher — kept for backward-compat with callers that
  // invoked `fetchSubmission` directly. Real fetches should use
  // `useGetSubmissionQuery(id)` from the service.
  const fetchSubmission = useCallback(async (_id: string) => null, []);

  const decideSubmission = useCallback(
    async (id: string, body: SubmissionDecisionBody) => {
      try {
        return await decide({ id, body }).unwrap();
      } catch (err) {
        return Promise.reject(getApiErrorMessage(err));
      }
    },
    [decide],
  );

  const publishSubmission = useCallback(
    async (id: string) => {
      try {
        return await publish(id).unwrap();
      } catch (err) {
        return Promise.reject(getApiErrorMessage(err));
      }
    },
    [publish],
  );

  const scanRisk = useCallback(
    async (id: string) => {
      try {
        return await scan(id).unwrap();
      } catch (err) {
        return Promise.reject(getApiErrorMessage(err));
      }
    },
    [scan],
  );

  return {
    fetchSubmission,
    decideSubmission,
    publishSubmission,
    scanRisk,
    isDeciding: decideState.isLoading,
    isPublishing: publishState.isLoading,
    isScanning: scanState.isLoading,
  };
}
