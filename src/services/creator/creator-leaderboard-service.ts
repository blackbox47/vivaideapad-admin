import type { CreatorLeaderboardOverview } from '@/models/creator/creator-leaderboard-model';
import { baseService } from '@/services/core/base-service';
import { CREATOR_LEADERBOARD_URL } from '@/utils/constants/api-end-points';

export const creatorLeaderboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorLeaderboard: builder.query<CreatorLeaderboardOverview, void>({
      query: () => ({ url: CREATOR_LEADERBOARD_URL, method: 'GET' }),
      providesTags: ['creator-leaderboard'],
    }),
  }),
});

export const { useGetCreatorLeaderboardQuery } = creatorLeaderboardService;
