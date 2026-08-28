import { useMemo } from 'react';

import type {
  DecidePayoutBody,
  Payout,
  PayoutListParams,
} from '@/models/payouts/payouts-model';
import {
  useDecidePayoutMutation,
  useGetPayoutsQuery,
} from '@/services/payouts/payouts-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UsePayoutsParams {
  status: PayoutListParams['status'];
  search: string;
}

interface UsePayoutsResult {
  payouts: Payout[];
  filtered: Payout[];
  totalCount: number;
  /** Count of payouts with status in {Requested, Under Review, Approved}. */
  awaitingCount: number;
  /** Sum of amountValue for awaiting payouts, formatted as "Tk 1,234". */
  awaitingTotal: string;
  /** Count of paid payouts. */
  paidCount: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  decidePayout: ReturnType<typeof useDecidePayoutMutation>[0];
  isDeciding: boolean;
}

const TAKA = new Intl.NumberFormat('en-US');

function formatTaka(value: number): string {
  return `Tk ${TAKA.format(Math.round(value))}`;
}

function matchesFilter(
  payout: Payout,
  status: PayoutListParams['status'],
  search: string,
): boolean {
  const matchesStatus = !status || status === 'all' || payout.status === status;
  const query = search.trim().toLowerCase();
  const matchesSearch =
    query.length === 0 ||
    payout.contributor.toLowerCase().includes(query) ||
    payout.methodDetail.toLowerCase().includes(query);

  return matchesStatus && matchesSearch;
}

export default function usePayouts({
  status,
  search,
}: UsePayoutsParams): UsePayoutsResult {
  const { data, isLoading, isError, error, refetch } = useGetPayoutsQuery();
  const [decidePayout, { isLoading: isDeciding }] = useDecidePayoutMutation();
  const payouts = Array.isArray(data?.payouts) ? data.payouts : [];

  const filtered = useMemo(
    () => payouts.filter((payout) => matchesFilter(payout, status, search)),
    [payouts, status, search],
  );

  const awaitingCount = useMemo(
    () =>
      payouts.filter(
        (payout) =>
          payout.status === 'Requested' ||
          payout.status === 'Under Review' ||
          payout.status === 'Approved',
      ).length,
    [payouts],
  );

  const awaitingTotal = useMemo(
    () =>
      formatTaka(
        payouts
          .filter(
            (payout) =>
              payout.status === 'Requested' ||
              payout.status === 'Under Review' ||
              payout.status === 'Approved',
          )
          .reduce((sum, payout) => sum + payout.amountValue, 0),
      ),
    [payouts],
  );

  const paidCount = useMemo(
    () => payouts.filter((payout) => payout.status === 'Paid').length,
    [payouts],
  );

  return {
    payouts,
    filtered,
    totalCount: data?.total ?? 0,
    awaitingCount,
    awaitingTotal,
    paidCount,
    isLoading: isLoading && !data,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    decidePayout,
    isDeciding,
  };
}

// Re-export the body type so consumers don't reach into models directly.
export type { DecidePayoutBody };