import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

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
import ConceptCard from '@/features/topics/concept-card';
import ConceptFilters from '@/features/topics/concept-filters';
import CreateConceptDialog from '@/features/topics/create-concept-dialog';
import useCreateConcept from '@/hooks/topics/use-create-concept';
import useTopics from '@/hooks/topics/use-topics';
import type { CreateConceptBody } from '@/models/topics/topics-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

const STATUS_FILTERS = [
  'all',
  'active',
  'draft',
  'scheduled',
  'archived',
] as const;

const PAGE_SIZE = 6;

type StatusFilter = (typeof STATUS_FILTERS)[number];

function parseStatus(value: string | null): StatusFilter {
  if (value && STATUS_FILTERS.includes(value as StatusFilter)) {
    return value as StatusFilter;
  }

  return 'all';
}

export default function TopicsOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseStatus(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data, isLoading, isError, error, refetch } = useTopics({
    status,
    search,
  });
  const {
    categories,
    submit: submitConcept,
    isSubmitting,
    error: createError,
    reset: resetCreate,
  } = useCreateConcept();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
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

  const handleCreate = async (body: CreateConceptBody) => {
    try {
      await submitConcept(body);
      closeCreate();
      setToast('Concept saved');
      window.setTimeout(() => setToast(null), 3200);
    } catch {
      // The hook's submit() rejects with a clear message on missing-category
      // lookup, and the mutation itself surfaces API errors via createError.
      // The dialog renders `createError` through the inherited `error` prop.
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

  const concepts = data?.concepts ?? [];
  const visibleConcepts = concepts.slice(0, visibleCount);
  const remainingCount = Math.max(0, concepts.length - visibleCount);

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Topics & concepts"
        description="Create, schedule and manage every live opportunity."
        action={
          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            + Create concept
          </Button>
        }
      />

      <ConceptFilters
        status={status}
        search={search}
        visibleCount={concepts.length}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[280px] rounded-[20px]" />
          ))}
        </div>
      ) : concepts.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">No concepts match</strong>
          <span className="text-[13px]">
            Try a different keyword or status filter.
          </span>
        </div>
      ) : (
        <>
          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {visibleConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
          {remainingCount > 0 ? (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-border bg-card px-[26px] py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more concepts · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}

      {isCreateOpen ? (
        <CreateConceptDialog
          categories={categories}
          isSubmitting={isSubmitting}
          error={getApiErrorMessage(createError)}
          onClose={closeCreate}
          onSubmit={handleCreate}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-[26px] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-primary px-[22px] py-3.5 text-[13px] font-semibold text-primary-foreground shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
