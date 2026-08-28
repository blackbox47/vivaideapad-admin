import { useEffect, useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useCategories from '@/hooks/categories/use-categories';
import type { Category } from '@/models/categories/categories-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import CategoryFormDialog from '@/features/categories/category-form-dialog';

export default function CategoriesOverview() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
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
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories({ search: debouncedSearch });

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleSubmit = async (
    body: { name: string; icon: string; isActive: boolean },
    id?: string,
  ) => {
    if (id) {
      const ok = await updateCategory(id, body);
      if (ok) {
        flash(`Category "${body.name}" updated`);
        setEditing(null);
      } else {
        flash('Could not update category');
      }
    } else {
      const created = await createCategory(body);
      if (created) {
        flash(`Category "${created.name}" created`);
        setIsCreateOpen(false);
      } else {
        flash('Could not create category');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteCategory(id);
    if (ok) {
      flash('Category deleted');
      setConfirmDelete(null);
    } else {
      flash('Could not delete category');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin"
        title="Categories"
        description="Manage the content taxonomy that powers Concepts."
        action={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New category
          </Button>
        }
      />

      {toast && (
        <div
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {toast}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Taxonomy</CardTitle>
          <CardDescription>
            Categories group Concepts on the public site and inside the admin
            workspace. Inactive categories stay hidden from new concepts but
            keep their history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name…"
              className="h-9 w-72 rounded-md border border-input bg-background px-3 text-sm"
            />
            <span className="text-sm text-muted-foreground">{total} total</span>
          </div>

          {isError && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-medium">Could not load categories</div>
                <div className="text-xs">{getApiErrorMessage(error)}</div>
              </div>
            </div>
          )}

          {isLoading && !categories.length ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-lg">{category.icon}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          category.isActive
                            ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700'
                            : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600'
                        }
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDelete(category)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!categories.length && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No categories match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          <div className="mt-3 text-right">
            <Button size="sm" variant="ghost" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-lg border bg-background p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Delete category?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirmDelete.name} will be removed from the taxonomy. Concepts
              already using this category stay untouched.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={isDeleting}
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