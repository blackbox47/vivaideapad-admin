import type {
  LeaderboardEntry,
  LeaderboardListParams,
  LeaderboardResponse,
  RecalculateRankingsResponse,
} from '@/models/leaderboard/leaderboard-model';
import { baseService } from '@/services/core/base-service';
import {
  LEADERBOARD_RECALCULATE_URL,
  LEADERBOARD_URL,
} from '@/utils/constants/api-end-points';
import { deriveInitials } from '@/utils/helpers/initials';

interface LeaderboardApiRow {
  rank?: number;
  user_id?: string;
  email?: string | null;
  display_name?: string | null;
  score?: string | number;
  approvals?: number;
  submissions_count?: number;
  streak?: number;
  last_updated?: string | null;
}

interface LeaderboardApiEnvelope {
  period?: string;
  data?: LeaderboardApiRow[];
  entries?: LeaderboardEntry[];
  topScore?: number;
  rankedCount?: number;
  averagePoints?: number;
}

export function toLeaderboardResponse(response: unknown): LeaderboardResponse {
  if (!response || typeof response !== 'object') {
    return { entries: [], topScore: 0, rankedCount: 0, averagePoints: 0 };
  }

  const raw = response as LeaderboardApiEnvelope;

  if (Array.isArray(raw.entries)) {
    return {
      entries: raw.entries,
      topScore: raw.topScore ?? (raw.entries[0]?.points ?? 0),
      rankedCount: raw.rankedCount ?? raw.entries.length,
      averagePoints: raw.averagePoints ?? 0,
    };
  }

  const rows = Array.isArray(raw.data) ? raw.data : [];
  const entries: LeaderboardEntry[] = rows.map((r, idx) => {
    const name = r.display_name?.trim() || r.email?.trim() || 'Unknown';
    const initials = deriveInitials(r.display_name, r.email ?? '');
    const points = Number(r.score ?? 0);
    return {
      id: r.user_id || String(idx + 1),
      rank: r.rank ?? idx + 1,
      name,
      initials,
      approvedIdeas: r.approvals ?? 0,
      points,
      visibility: 'Public',
    };
  });

  const topScore = entries.length > 0 ? entries[0].points : 0;
  const rankedCount = entries.length;
  const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);
  const averagePoints =
    rankedCount > 0 ? Math.round(totalPoints / rankedCount) : 0;

  return {
    entries,
    topScore,
    rankedCount,
    averagePoints,
  };
}

export const leaderboardService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<
      LeaderboardResponse,
      LeaderboardListParams | void
    >({
      query: (params) => ({
        url: LEADERBOARD_URL,
        method: 'GET',
        params: { search: params?.search?.trim() || undefined },
      }),
      transformResponse: toLeaderboardResponse,
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
      transformResponse: () => ({
        recalculatedAt: new Date().toISOString(),
      }),
      invalidatesTags: ['leaderboard'],
    }),
  }),
});

export const {
  useGetLeaderboardQuery,
  useRecalculateRankingsMutation,
} = leaderboardService;