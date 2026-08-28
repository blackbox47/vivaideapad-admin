import { createFileRoute } from '@tanstack/react-router';

import LeaderboardPage from '@/pages/leaderboard';

/** `/admin/leaderboard` */
export const Route = createFileRoute('/admin/_admin/leaderboard')({
  component: LeaderboardPage,
});