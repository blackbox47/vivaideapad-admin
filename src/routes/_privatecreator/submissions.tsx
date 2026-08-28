import { createFileRoute } from '@tanstack/react-router';

import MyIdeasPage from '@/pages/creator/my-ideas';

/** `/submissions` */
export const Route = createFileRoute('/_privatecreator/submissions')({
  component: MyIdeasPage,
});