import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';

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
import EmptyState from '@/components/shared/empty-state';
import BulkActionBar from '@/features/topics/bulk-action-bar';
import ConceptCard from '@/features/topics/concept-card';
import ConceptFilters from '@/features/topics/concept-filters';
import CreateConceptDialog from '@/features/topics/create-concept-dialog';
import EditConceptDialog from '@/features/topics/edit-concept-dialog';
import useCreateConcept from '@/hooks/topics/use-create-concept';
import useEditConcept from '@/hooks/topics/use-edit-concept';
import useTopics from '@/hooks/topics/use-topics';
import { useBulkConceptActionMutation } from '@/services/topics/topics-service';
import type {
  Concept,
  ConceptStatus,
  CreateConceptBody,
  UpdateConceptBody,
} from '@/models/topics/topics-model';
import { DEFAULT_PAGE_SIZE as PAGE_SIZE } from '@/utils/constants/pagination';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import { toast } from '@/components/ui/sonner';

const STATUS_FILTERS = [
  'all',
  'active',
  'draft',
  'archived',
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];

function parseStatus(value: string | null): StatusFilter {
  if (value && STATUS_FILTERS.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }

  return 'all';
}

export default function TopicsOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const status = parseStatus(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, error, refetch } = useTopics({
    status,
    search,
  });
  const [bulkActionMutation, { isLoading: isBulkLoading }] =
    useBulkConceptActionMutation();

  const {
    categories,
    submit: submitConcept,
    isSubmitting,
    error: createError,
    reset: resetCreate,
  } = useCreateConcept();
  const {
    categories: editCategories,
    submit: submitEditConcept,
    isSubmitting: isEditSubmitting,
    error: editError,
    reset: resetEdit,
  } = useEditConcept();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
      setSelectedIds(new Set());
    }, 0);
  }, [status, search]);

  const setSearch = (next: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (next.trim().length === 0) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', next);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const closeCreate = () => {
    resetCreate();
    setIsCreateOpen(false);
  };

  const closeEdit = () => {
    resetEdit();
    setEditingConcept(null);
  };

  const handleCreate = async (body: CreateConceptBody) => {
    try {
      await submitConcept(body);
      closeCreate();
      toast.success('Concept saved');
    } catch {
      // Handled by createError
    }
  };

  const handleEdit = async (id: string, body: UpdateConceptBody) => {
    try {
      await submitEditConcept(id, body);
      closeEdit();
      toast.success('Concept updated');
    } catch {
      // Handled by editError
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const concepts = data?.concepts ?? [];
  const visibleConcepts = concepts.slice(0, visibleCount);
  const remainingCount = Math.max(0, concepts.length - visibleCount);

  const allVisibleSelected =
    visibleConcepts.length > 0 &&
    visibleConcepts.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleConcepts.map((c) => c.id)));
    }
  };

  const handleSetActive = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkActionMutation({
        action: 'set_status',
        ids: Array.from(selectedIds),
        status: 'active',
      }).unwrap();
      toast.success(
        `Set ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'} to Active`,
      );
      deselectAll();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to update status');
    }
  };

  const handleSetOnboarding = async (flag: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkActionMutation({
        action: flag ? 'set_is_onboarding' : 'remove_is_onboarding',
        ids: Array.from(selectedIds),
        is_onboarding: flag,
      }).unwrap();
      toast.success(
        flag
          ? `Marked ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'} as Onboarding (NEW)`
          : `Removed Onboarding from ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'}`,
      );
      deselectAll();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to update concepts');
    }
  };

  const handleToggleForNewUsers = async () => {
    if (selectedIds.size === 0) return;
    const selectedConcepts = concepts.filter((c) => selectedIds.has(c.id));
    const allAreOnboarding =
      selectedConcepts.length > 0 &&
      selectedConcepts.every((c) => c.isOnboarding);
    await handleSetOnboarding(!allAreOnboarding);
  };

  const handleChangeStatus = async (newStatus: ConceptStatus) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkActionMutation({
        action: 'set_status',
        ids: Array.from(selectedIds),
        status: newStatus,
      }).unwrap();
      toast.success(
        `Updated ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'} to ${newStatus}`,
      );
      deselectAll();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to update status');
    }
  };

  const handleDuplicate = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkActionMutation({
        action: 'duplicate',
        ids: Array.from(selectedIds),
      }).unwrap();
      toast.success(
        `Duplicated ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'}`,
      );
      deselectAll();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to duplicate concepts');
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkActionMutation({
        action: 'delete',
        ids: Array.from(selectedIds),
      }).unwrap();
      toast.success(
        `Deleted ${selectedIds.size} ${selectedIds.size === 1 ? 'concept' : 'concepts'}`,
      );
      deselectAll();
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Failed to delete concepts');
    }
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load concepts
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        title="Topics & concepts"
        description="Create, schedule and manage every live opportunity."
        action={
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest cursor-pointer"
          >
            + Create concept
          </Button>
        }
      />

      <ConceptFilters
        status={status}
        search={search}
        visibleCount={concepts.length}
        selectedCount={selectedIds.size}
        allSelected={allVisibleSelected}
        onToggleSelectAll={toggleSelectAll}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-70 rounded-[20px]" />
          ))}
        </div>
      ) : concepts.length === 0 ? (
        <EmptyState
          title="No concepts match"
          description="Try a different keyword or status filter."
        />
      ) : (
        <>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleConcepts.map((concept) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                isSelected={selectedIds.has(concept.id)}
                onToggleSelect={toggleSelect}
                onEdit={(c) => setEditingConcept(c)}
              />
            ))}
          </div>
          {remainingCount > 0 ? (
            <div className="mt-7 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="h-auto rounded-full border-border bg-card px-6.5 py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle cursor-pointer"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more concepts · {remainingCount} remaining
              </Button>
            </div>
          ) : null}
        </>
      )}

      <BulkActionBar
        selectedCount={selectedIds.size}
        isLoading={isBulkLoading}
        onSetActive={handleSetActive}
        onToggleForNewUsers={handleToggleForNewUsers}
        onSetOnboarding={handleSetOnboarding}
        onChangeStatus={handleChangeStatus}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onDeselectAll={deselectAll}
      />

      {isCreateOpen ? (
        <CreateConceptDialog
          categories={categories}
          isSubmitting={isSubmitting}
          error={getApiErrorMessage(createError)}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />
      ) : null}

      {editingConcept ? (
        <EditConceptDialog
          concept={editingConcept}
          categories={editCategories.length > 0 ? editCategories : categories}
          isSubmitting={isEditSubmitting}
          error={getApiErrorMessage(editError)}
          onClose={closeEdit}
          onSubmit={handleEdit}
        />
      ) : null}
    </div>
  );
}

