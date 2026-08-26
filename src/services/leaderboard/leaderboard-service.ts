import type {
  LeaderboardListParams,
  LeaderboardResponse,
  RecalculateRankingsResponse,
} from '@/models/leaderboard/leaderboard-model';
import { baseService } from '@/services/core/base-service';
import {
  LEADERBOARD_RECALCULATE_URL,
  LEADERBOARD_URL,
} from '@/utils/constants/api-end-points';

export const leaderboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<
      LeaderboardResponse,
      LeaderboardListParams | void
    >({
      query: (params) => ({
        url: LEADERBOARD_URL,
        method: 'GET',
        params: { search: params?.search },
      }),
      providesTags: ['leaderboard'],
    }),
    recalculateRankings: builder.mutation<
      RecalculateRankingsResponse,
      void
    >({
      query: () => ({
        url: LEADERBOARD_RECALCULATE_URL,
        method: 'POST',
      }),
      invalidatesTags: ['leaderboard'],
    }),
  }),
});

export const {
  useGetLeaderboardQuery,
  useRecalculateRankingsMutation,
} = leaderboardService;