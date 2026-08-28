import { useMemo } from 'react';

import type {
  LedgerEntry,
  LedgerListParams,
  LedgerListResponse,
} from '@/models/rewards/rewards-model';
import { useGetLedgerQuery } from '@/services/rewards/rewards-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseRewardsResult {
  entries: LedgerEntry[];
  totalCount: number;
  /** Sum of credit (positive) entries, formatted as "Tk 1,234". */
  totalRewarded: string;
  /** Sum of pending entries (positive), formatted as "Tk 1,234". */
  pendingTotal: string;
  /** Average reward amount across Reward-typed entries, formatted as "Tk 212". */
  averageReward: string;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

const TAKA = new Intl.NumberFormat('en-US');

function formatTaka(value: number): string {
  return `Tk ${TAKA.format(Math.round(value))}`;
}

function sumAmount(entries: LedgerEntry[] | undefined, predicate: (entry: LedgerEntry) => boolean): number {
  if (!Array.isArray(entries)) {
    return 0;
  }
  return entries
    .filter(predicate)
    .reduce((total, entry) => total + entry.amountValue, 0);
}

export default function useRewards(params: LedgerListParams): UseRewardsResult {
  const { data, isLoading, isError, error, refetch } = useGetLedgerQuery();

  const filtered = useMemo((): LedgerListResponse | null => {
    if (!data) {
      return null;
    }

    return {
      entries: Array.isArray(data.entries) ? data.entries : [],
      total: data.total ?? (Array.isArray(data.entries) ? data.entries.length : 0),
    };
  }, [data]);

  const entries = Array.isArray(filtered?.entries) ? filtered.entries : [];
  const totalCount = filtered?.total ?? 0;

  const totalRewarded = useMemo(
    () => formatTaka(sumAmount(entries, (entry) => entry.type === 'Reward')),
    [entries],
  );

  const pendingTotal = useMemo(
    () =>
      formatTaka(
        sumAmount(
          entries,
          (entry) => entry.status === 'Pending' && entry.type === 'Reward',
        ),
      ),
    [entries],
  );

  const averageReward = useMemo(() => {
    const rewardEntries = entries.filter((entry) => entry.type === 'Reward');
    if (rewardEntries.length === 0) {
      return 'Tk 0';
    }

    const total = rewardEntries.reduce(
      (sum, entry) => sum + entry.amountValue,
      0,
    );
    return formatTaka(total / rewardEntries.length);
  }, [entries]);

  // Reference params so the hook signature mirrors siblings (filtering is server-side).
  void params;

  return {
    entries,
    totalCount,
    totalRewarded,
    pendingTotal,
    averageReward,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}