import { createFileRoute } from '@tanstack/react-router';

import TopicsPage from '@/pages/topics';

/** `/admin/topics` */
export const Route = createFileRoute('/admin/_admin/topics')({
  component: TopicsPage,
});