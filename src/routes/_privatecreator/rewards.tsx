import { createFileRoute } from '@tanstack/react-router';

import CreatorRewardsPage from '@/pages/creator/rewards';

/** `/rewards` */
export const Route = createFileRoute('/_privatecreator/rewards')({
  component: CreatorRewardsPage,
});