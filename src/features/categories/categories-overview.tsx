import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import StatusBadge from '@/components/shared/status-badge';
import TableActions from '@/components/shared/table-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import { toast } from '@/components/ui/sonner';
import CategoryFormDialog from '@/features/categories/category-form-dialog';
import useCategories from '@/hooks/categories/use-categories';
import usePagination from '@/hooks/ui/use-pagination';
import type { Category } from '@/models/categories/categories-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export default function CategoriesOverview() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(handle);
  }, [search]);

  const {
    categories,
    total,
    isLoading,
    isError,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories({ search: debouncedSearch });

  const { paginatedItems, paginationProps } = usePagination({
    items: categories,
    initialPageSize: 6,
  });

  const handleSubmit = async (
    body: { name: string; icon: string; isActive: boolean },
    id?: string,
  ) => {
    if (id) {
      const ok = await updateCategory(id, body);
      if (ok) {
        toast.success(`Category "${body.name}" updated`);
        setEditing(null);
      } else {
        toast.error('Could not update category');
      }
    } else {
      const created = await createCategory(body);
      if (created) {
        toast.success(`Category "${created.name}" created`);
        setIsCreateOpen(false);
      } else {
        toast.error('Could not create category');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteCategory(id);
    if (ok) {
      toast.success('Category deleted');
      setConfirmDelete(null);
    } else {
      toast.error('Could not delete category');
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage the content taxonomy that powers Concepts and submissions."
        action={
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            + New category
          </Button>
        }
      />

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="whitespace-nowrap text-[13px] text-muted-foreground">
          {total} {total === 1 ? 'category' : 'categories'}
        </span>
        <div className="relative w-full sm:w-72">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories…"
            aria-label="Search categories"
            className="rounded-full px-4.5 py-2.5 text-[13px] placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {isError && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <div className="font-semibold">Could not load categories</div>
            <div className="text-xs">{getApiErrorMessage(error)}</div>
          </div>
        </div>
      )}

      <ProjectTable
        columns={[
          { label: 'Icon', headerClassName: 'w-16 text-center' },
          { label: 'Category' },
          { label: 'Status' },
          { label: '', isAction: true },
        ]}
        isLoading={isLoading}
        loadingRows={4}
        isEmpty={categories.length === 0}
        emptyTitle="No categories match"
        emptyDescription="Try a different search keyword or create a new category."
        pagination={paginationProps}
      >
        {paginatedItems.map((category) => (
          <ProjectTableRow key={category.id}>
            <ProjectTableCell className="text-center text-xl">
              {category.icon}
            </ProjectTableCell>
            <ProjectTableCell>
              <strong className="font-semibold text-foreground">
                {category.name}
              </strong>
            </ProjectTableCell>
            <ProjectTableCell>
              <StatusBadge status={category.isActive ? 'Active' : 'Inactive'} />
            </ProjectTableCell>
            <ProjectTableCell align="right">
              <TableActions>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto rounded-full border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle"
                  onClick={() => setEditing(category)}
                >
                  Edit
                </Button>
                <button
                  type="button"
                  className="rounded-full border border-danger-subtle bg-card px-[13px] py-[7px] text-xs font-bold text-danger hover:bg-danger-subtle transition-colors cursor-pointer"
                  onClick={() => setConfirmDelete(category)}
                >
                  Delete
                </button>
              </TableActions>
            </ProjectTableCell>
          </ProjectTableRow>
        ))}
      </ProjectTable>

      {isCreateOpen && (
        <CategoryFormDialog
          mode="create"
          isSubmitting={isCreating}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {editing && (
        <CategoryFormDialog
          mode="edit"
          category={editing}
          isSubmitting={isUpdating}
          onClose={() => setEditing(null)}
          onSubmit={(body) => handleSubmit(body, editing.id)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-110 rounded-[24px] border border-border bg-card p-7 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-extrabold tracking-[0.12em] text-muted-foreground uppercase">
                  Delete taxonomy
                </p>
                <h2
                  id="delete-category-title"
                  className="mt-1 font-heading text-[20px] font-semibold text-foreground"
                >
                  Delete {confirmDelete.name}?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              {confirmDelete.name} will be removed from the taxonomy. Concepts
              already using this category will stay untouched.
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="h-auto rounded-full border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-surface-subtle"
                onClick={() => setConfirmDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-auto rounded-full bg-destructive px-5 py-2.5 text-xs font-bold text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={isDeleting}
                loading={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}