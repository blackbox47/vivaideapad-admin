import { useCallback } from 'react';

import type {
  PayoutDetail,
  ProcessPayoutBody,
} from '@/models/payouts/payouts-model';
import { useProcessPayoutMutation } from '@/services/payouts/payouts-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UsePayoutSpecResult {
  fetchPayout: (id: string) => Promise<PayoutDetail | null>;
  processPayout: (
    id: string,
    body: ProcessPayoutBody,
  ) => Promise<unknown>;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Hook façade for the spec-aligned payouts endpoints (REST spec §5.6).
 *
 * For detail fetches, prefer the inline `useGetPayoutQuery(id)` from the
 * service.
 */
export default function usePayoutSpec(): UsePayoutSpecResult {
  const [triggerProcess, processState] = useProcessPayoutMutation();

  // Stub fetcher kept for backward-compat — real fetches should use
  // `useGetPayoutQuery(id)` from the service.
  const fetchPayout = useCallback(async (_id: string) => null, []);

  const processPayout = useCallback(
    async (id: string, body: ProcessPayoutBody) => {
      try {
        return await triggerProcess({ id, body }).unwrap();
      } catch (err) {
        return Promise.reject(getApiErrorMessage(err));
      }
    },
    [triggerProcess],
  );

  return {
    fetchPayout,
    processPayout,
    isProcessing: processState.isLoading,
    error: getApiErrorMessage(processState.error),
  };
}