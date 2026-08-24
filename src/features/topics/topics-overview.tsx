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
import useTopics from '@/hooks/topics/use-topics';

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
          <Button className="h-auto rounded-full bg-[#12231f] px-5 py-3 font-bold text-white hover:bg-[#254b40]">
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
        <div className="rounded-[22px] border border-[#dfe7e3] bg-white px-6 py-[60px] text-center text-[#687773]">
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
                className="rounded-full border border-[#dfe7e3] bg-white px-[26px] py-3 text-[13px] font-bold text-foreground"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more concepts · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
