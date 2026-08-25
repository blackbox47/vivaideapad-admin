import { useGetCreatorLeaderboardQuery } from '@/services/creator/creator-leaderboard-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export function formatLeaderboardPoints(value: number): string {
  return NUMBER_FORMAT.format(Math.round(value));
}

export default function useCreatorLeaderboard() {
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorLeaderboardQuery();

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
