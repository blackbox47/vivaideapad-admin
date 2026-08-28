import { createFileRoute } from '@tanstack/react-router';

import ApplicantsPage from '@/pages/applicants';

/** `/admin/applicants` */
export const Route = createFileRoute('/admin/_admin/applicants')({
  component: ApplicantsPage,
});