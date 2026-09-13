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
import OpportunityCard from '@/features/creator/opportunity-card';
import OpportunityFilters from '@/features/creator/opportunity-filters';
import OpportunityLoadMore from '@/features/creator/opportunity-load-more';
import useCreatorTopics from '@/hooks/creator/use-creator-topics';
import {
  OPPORTUNITY_CATEGORIES,
  type OpportunityCategoryFilter,
} from '@/models/creator/submit-idea-model';
import { DEFAULT_API_PAGE_SIZE as PAGE_SIZE } from '@/utils/constants/pagination';

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

  const {
    data,
    total,
    hasMore,
    remainingCount,
    loadMore,
    isLoading,
    isFetchingMore,
    isError,
    error,
    refetch,
  } = useCreatorTopics({
    category,
    search,
    limit: PAGE_SIZE,
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
  const hasClientFilter = category !== 'All' || search.trim().length > 0;
  const displayCount = hasClientFilter ? topics.length : total;
  const countLabel = `${displayCount} ${displayCount === 1 ? 'brief' : 'briefs'}`;

  return (
    <div className="pb-4">
      <PageHeader
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
            <Skeleton key={index} className="h-80 rounded-[22px]" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <EmptyState
          title="No briefs match your search"
          description="Try a different keyword or clear the category filter."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <OpportunityCard key={topic.id} topic={topic} />
            ))}
          </div>
          {hasMore ? (
            <OpportunityLoadMore
              remainingCount={remainingCount}
              isLoading={isFetchingMore}
              onLoadMore={loadMore}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
