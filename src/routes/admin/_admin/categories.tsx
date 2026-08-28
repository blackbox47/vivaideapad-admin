import { createFileRoute } from '@tanstack/react-router';

import CategoriesPage from '@/pages/categories';

/** `/admin/categories` */
export const Route = createFileRoute('/admin/_admin/categories')({
  component: CategoriesPage,
});