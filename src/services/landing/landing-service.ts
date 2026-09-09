import type {
  FeaturedRequestApi,
  LandingStats,
  LeaderboardRowApi,
} from '@/models/landing/landing-model';
import { baseService } from '@/services/core/base-service';
import {
  PUBLIC_LANDING_FEATURED_REQUESTS_URL,
  PUBLIC_LANDING_STATS_URL,
  PUBLIC_LEADERBOARD_URL,
} from '@/utils/constants/api-end-points';

export const landingService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLandingStats: builder.query<{ data: LandingStats }, void>({
      query: () => ({
        url: PUBLIC_LANDING_STATS_URL,
        method: 'GET',
      }),
      providesTags: ['landing-stats'],
    }),
    getPublicFeaturedRequests: builder.query<
      { data: FeaturedRequestApi[] },
      number | void
    >({
      query: (limit = 3) => ({
        url: PUBLIC_LANDING_FEATURED_REQUESTS_URL,
        method: 'GET',
        params: { limit: limit ?? 3 },
      }),
      providesTags: ['landing-featured'],
    }),
    getPublicLeaderboard: builder.query<
      { data: LeaderboardRowApi[] },
      number | void
    >({
      query: (limit = 5) => ({
        url: PUBLIC_LEADERBOARD_URL,
        method: 'GET',
        params: { limit: limit ?? 5 },
      }),
      providesTags: ['public-leaderboard'],
    }),
  }),
});

export const {
  useGetPublicLandingStatsQuery,
  useGetPublicFeaturedRequestsQuery,
  useGetPublicLeaderboardQuery,
} = landingService;
