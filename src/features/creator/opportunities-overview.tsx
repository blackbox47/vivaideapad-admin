import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';
import useResetStateOnChange from '@/hooks/ui/use-reset-state-on-change';

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
import OpportunityCard from '@/features/creator/opportunity-card';
import OpportunityFilters from '@/features/creator/opportunity-filters';
import useCreatorTopics from '@/hooks/creator/use-creator-topics';
import {
  OPPORTUNITY_CATEGORIES,
  type OpportunityCategoryFilter,
} from '@/models/creator/submit-idea-model';

const PAGE_SIZE = 6;

function parseCategory(value: string | null): OpportunityCategoryFilter {
  if (
    value &&
    (OPPORTUNITY_CATEGORIES as readonly string[]).includes(value)
  ) {
    return value as OpportunityCategoryFilter;
  }

  return 'All';
}

export default function OpportunitiesOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const category = parseCategory(searchParams.get('category'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useResetStateOnChange(PAGE_SIZE, [
    category,
    search,
  ]);

  const { data, isLoading, isError, error, refetch } = useCreatorTopics({
    category,
    search,
  });

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
            Could not load opportunities
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const topics = data?.topics ?? [];
  const visibleTopics = topics.slice(0, visibleCount);
  const remainingCount = Math.max(0, topics.length - visibleCount);
  const countLabel = `${topics.length} ${topics.length === 1 ? 'brief' : 'briefs'}`;

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Live concepts"
        title="Find your next spark."
        description="Choose a brief that matches your curiosity and experience."
        action={
          <span className="whitespace-nowrap text-[13px] text-muted-foreground">
            {isLoading ? '…' : countLabel}
          </span>
        }
      />

      <OpportunityFilters
        category={category}
        search={search}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[320px] rounded-[22px]" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">
            No briefs match your search
          </strong>
          <span className="text-[13px]">
            Try a different keyword or clear the category filter.
          </span>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTopics.map((topic) => (
              <OpportunityCard key={topic.id} topic={topic} />
            ))}
          </div>
          {remainingCount > 0 ? (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-border bg-card px-[26px] py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more briefs · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
