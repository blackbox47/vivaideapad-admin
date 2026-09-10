import { useMemo } from 'react';

import type { CreatorLeaderboardOverview } from '@/models/creator/creator-leaderboard-model';
import {
  formatLeaderboardPoints,
  personalizeCreatorLeaderboard,
  useGetCreatorLeaderboardQuery,
} from '@/services/creator/creator-leaderboard-service';
import { useAppSelector } from '@/store/hooks';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export { formatLeaderboardPoints };

export default function useCreatorLeaderboard() {
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const { data, isLoading, isError, error, refetch } =
    useGetCreatorLeaderboardQuery();

  const personalizedData = useMemo<CreatorLeaderboardOverview | null>(() => {
    if (!data) return null;
    return personalizeCreatorLeaderboard(data, currentUserId);
  }, [data, currentUserId]);

  return {
    data: personalizedData,
    isLoading,
    isError,
    error: getApiErrorMessage(error),
    refetch,
  };
}
