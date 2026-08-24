import { useMemo } from 'react';

import type {
  LeaderboardEntry,
  LeaderboardListParams,
  LeaderboardResponse,
} from '@/models/leaderboard/leaderboard-model';
import {
  useGetLeaderboardQuery,
  useRecalculateRankingsMutation,
} from '@/services/leaderboard/leaderboard-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface UseLeaderboardResult {
  podium: LeaderboardEntry[];
  standings: LeaderboardEntry[];
  topScore: number;
  rankedCount: number;
  averagePoints: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  recalculate: () => Promise<unknown>;
  isRecalculating: boolean;
}

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

function formatPoints(value: number): string {
  return NUMBER_FORMAT.format(Math.round(value));
}

export default function useLeaderboard(
  params: LeaderboardListParams = {},
): UseLeaderboardResult {
  const { search } = params;
  const { data, isLoading, isError, error, refetch } = useGetLeaderboardQuery({
    search,
  });

  const [
    recalculateRankings,
    { isLoading: isRecalculating },
  ] = useRecalculateRankingsMutation();

  const response = data as LeaderboardResponse | undefined;

  const podium = useMemo(
    () => (response?.entries ?? []).slice(0, 3),
    [response],
  );

  const standings = useMemo(
    () => (response?.entries ?? []).slice(3),
    [response],
  );

  const topScore = response?.topScore ?? 0;
  const rankedCount = response?.rankedCount ?? 0;
  const averagePoints = response?.averagePoints ?? 0;

  const recalculate = () =>
    recalculateRankings().unwrap().then((result) => result);

  return {
    podium,
    standings,
    topScore,
    rankedCount,
    averagePoints,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
    recalculate,
    isRecalculating,
  };
}

export { formatPoints };