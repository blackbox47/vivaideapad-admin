import { useCallback } from 'react';

import type {
  CreateAdjustmentBody,
  LedgerEntry,
  LedgerListResponse,
} from '@/models/rewards/rewards-model';
import {
  useGetLedgerQuery,
  useManualAdjustmentMutation,
} from '@/services/ledger/ledger-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseLedgerParams {
  type?: 'all' | 'Reward' | 'Withdrawal' | 'Adjustment';
  userId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseLedgerResult {
  entries: LedgerEntry[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  manualAdjustment: (body: CreateAdjustmentBody) => Promise<LedgerEntry | null>;
  isAdjusting: boolean;
}

export default function useLedger(
  params: UseLedgerParams = {},
): UseLedgerResult {
  const { data, isLoading, isError, error, refetch } = useGetLedgerQuery({
    type: params.type,
    userId: params.userId,
    status: params.status,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    search: params.search,
    page: params.page,
    limit: params.limit,
  });
  const [trigger, state] = useManualAdjustmentMutation();

  const manualAdjustment = useCallback(
    async (body: CreateAdjustmentBody) => {
      try {
        const result = await trigger(body).unwrap();
        return result.entry;
      } catch {
        return null;
      }
    },
    [trigger],
  );

  return {
    entries: (data as LedgerListResponse | undefined)?.entries ?? [],
    total: (data as LedgerListResponse | undefined)?.total ?? 0,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    manualAdjustment,
    isAdjusting: state.isLoading,
  };
}