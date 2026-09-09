export interface LandingStats {
  activeRequests: number;
  ideasSubmitted: number;
  totalPrizes: number;
  ideasRewardedUsd: number;
  ideasCount: number;
  approvalRatePct: number;
  avgReviewTurnaroundHours: number | null;
}

export interface FeaturedRequestApi {
  id: string;
  category: string;
  daysLeft: number;
  title: string;
  description: string;
  tags: string[];
  postedBy: string;
  amount: number;
  ideas: number;
}

export interface LeaderboardRowApi {
  rank: number;
  initials: string;
  name: string;
  wins: number;
  ideas: number;
  amount: number;
}
