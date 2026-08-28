import { createFileRoute } from '@tanstack/react-router';

import ContentReviewPage from '@/pages/content-review';

/** `/admin/content-review` */
export const Route = createFileRoute('/admin/_admin/content-review')({
  component: ContentReviewPage,
});