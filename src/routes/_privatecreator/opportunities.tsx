import { createFileRoute } from '@tanstack/react-router';

import OpportunitiesPage from '@/pages/creator/opportunities';

/** `/opportunities` */
export const Route = createFileRoute('/_privatecreator/opportunities')({
  component: OpportunitiesPage,
});