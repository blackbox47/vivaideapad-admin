export type LeaderboardVisibility = 'Public' | 'Hidden';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  initials: string;
  approvedIdeas: number;
  points: number;
  visibility: LeaderboardVisibility;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  topScore: number;
  rankedCount: number;
  averagePoints: number;
}

export interface LeaderboardListParams {
  search?: string;
}

export interface RecalculateRankingsResponse {
  recalculatedAt: string;
}