import { AlertCircle } from 'lucide-react';
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';
import usePagination from '@/hooks/ui/use-pagination';

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
import RewardFilters, {
  parseRewardType,
} from '@/features/rewards/reward-filters';
import RewardKpiCards from '@/features/rewards/reward-kpi-cards';
import RewardTable from '@/features/rewards/reward-table';
import useRewards from '@/hooks/rewards/use-rewards';

export default function RewardsOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const type = parseRewardType(searchParams.get('type'));
  const search = searchParams.get('q') ?? '';

  const {
    entries,
    totalCount,
    totalRewarded,
    pendingTotal,
    averageReward,
    isLoading,
    isError,
    error,
    refetch,
  } = useRewards({ type, search });

  const setSearch = (next: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (next.trim().length === 0) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', next);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const { paginatedItems, paginationProps } = usePagination({
    items: entries,
    initialPageSize: 6,
  });

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load ledger
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
        title="Rewards ledger"
        description="Track every reward, balance adjustment and release."
      />

      <RewardKpiCards
        isLoading={isLoading}
        items={[
          { id: 'total', label: 'Total rewarded', value: totalRewarded },
          {
            id: 'pending',
            label: 'Pending payouts',
            value: pendingTotal,
            tone: 'danger',
          },
          { id: 'average', label: 'Average reward', value: averageReward },
        ]}
      />

      {isLoading ? null : (
        <RewardFilters
          type={type}
          search={search}
          visibleCount={totalCount}
          onSearchChange={setSearch}
        />
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-[18px] border border-border bg-card p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          title="No entries match"
          description="Try a different keyword or type filter."
        />
      ) : (
        <RewardTable
          entries={paginatedItems}
          pagination={paginationProps}
        />
      )}
    </div>
  );
}