import { createFileRoute } from '@tanstack/react-router';

import CreatorProfilePage from '@/pages/creator/profile';

/** `/profile` */
export const Route = createFileRoute('/_privatecreator/profile')({
  component: CreatorProfilePage,
});