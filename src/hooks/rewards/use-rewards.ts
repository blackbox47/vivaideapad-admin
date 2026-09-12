import { useMemo } from 'react';

import type {
  LedgerEntry,
  LedgerListParams,
  LedgerTypeFilter,
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

function sumAmount(
  entries: LedgerEntry[] | undefined,
  predicate: (entry: LedgerEntry) => boolean,
): number {
  if (!Array.isArray(entries)) {
    return 0;
  }
  return entries
    .filter(predicate)
    .reduce((total, entry) => total + entry.amountValue, 0);
}

function matchesFilter(
  entry: LedgerEntry,
  type: LedgerTypeFilter | undefined,
  search: string | undefined,
): boolean {
  const matchesType = !type || type === 'all' || entry.type === type;
  const query = (search ?? '').trim().toLowerCase();
  const matchesSearch =
    query.length === 0 ||
    (entry.contributor ?? '').toLowerCase().includes(query) ||
    (entry.description ?? '').toLowerCase().includes(query);

  return matchesType && matchesSearch;
}

export default function useRewards({
  type,
  search,
}: LedgerListParams): UseRewardsResult {
  const { data, isLoading, isError, error, refetch } = useGetLedgerQuery();

  const allEntries = useMemo(() => {
    return Array.isArray(data?.entries) ? data.entries : [];
  }, [data]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => matchesFilter(entry, type, search));
  }, [allEntries, type, search]);

  const totalRewarded = useMemo(
    () => formatTaka(sumAmount(allEntries, (entry) => entry.type === 'Reward')),
    [allEntries],
  );

  const pendingTotal = useMemo(
    () =>
      formatTaka(
        sumAmount(
          allEntries,
          (entry) => entry.status === 'Pending' && entry.type === 'Reward',
        ),
      ),
    [allEntries],
  );

  const averageReward = useMemo(() => {
    const rewardEntries = allEntries.filter((entry) => entry.type === 'Reward');
    if (rewardEntries.length === 0) {
      return 'Tk 0';
    }

    const total = rewardEntries.reduce(
      (sum, entry) => sum + entry.amountValue,
      0,
    );
    return formatTaka(total / rewardEntries.length);
  }, [allEntries]);

  return {
    entries: filteredEntries,
    totalCount: filteredEntries.length,
    totalRewarded,
    pendingTotal,
    averageReward,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}