import type { CreatorStat } from '@/models/creator/creator-dashboard-model';

export interface CreatorLeaderboardPerson {
  id: string;
  rank: number;
  rankLabel: string;
  name: string;
  initials: string;
  points: number;
  approved: number;
  streak: string;
  avatarBg: string;
  visibility: string;
  medal?: string;
  isYou?: boolean;
  showGap?: boolean;
}

export interface CreatorLeaderboardOverview {
  eyebrow: string;
  title: string;
  description: string;
  visibility: string;
  stats: CreatorStat[];
  podium: CreatorLeaderboardPerson[];
  standings: CreatorLeaderboardPerson[];
}
