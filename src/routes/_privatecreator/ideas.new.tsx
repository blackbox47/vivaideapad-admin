import { createFileRoute } from '@tanstack/react-router';

import SubmitIdeaPage from '@/pages/creator/submit-idea';

/** `/ideas/new` */
export const Route = createFileRoute('/_privatecreator/ideas/new')({
  component: SubmitIdeaPage,
});