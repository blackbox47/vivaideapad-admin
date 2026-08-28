import { createFileRoute } from '@tanstack/react-router';

import CreatorLeaderboardPage from '@/pages/creator/leaderboard';

/** `/leaderboard` */
export const Route = createFileRoute('/_privatecreator/leaderboard')({
  component: CreatorLeaderboardPage,
});