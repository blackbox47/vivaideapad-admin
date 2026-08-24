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
import RewardFilters, {
  parseRewardType,
} from '@/features/rewards/reward-filters';
import RewardKpiCards from '@/features/rewards/reward-kpi-cards';
import RewardTable from '@/features/rewards/reward-table';
import useRewards from '@/hooks/rewards/use-rewards';

const PAGE_SIZE = 6;

export default function RewardsOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = parseRewardType(searchParams.get('type'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [type, search]);

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

  const visibleEntries = entries.slice(0, visibleCount);
  const remainingCount = Math.max(0, entries.length - visibleCount);

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Rewards ledger"
        description="Track every reward, balance adjustment and release."
        action={
          <Button className="h-auto rounded-full bg-[#12231f] px-5 py-3 font-bold text-white hover:bg-[#254b40]">
            + Add adjustment
          </Button>
        }
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
        <div className="overflow-hidden rounded-[18px] border border-[#dfe7e3] bg-white p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-[22px] border border-[#dfe7e3] bg-white px-6 py-[60px] text-center text-[#687773]">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">
            No entries match
          </strong>
          <span className="text-[13px]">
            Try a different keyword or type filter.
          </span>
        </div>
      ) : (
        <>
          <RewardTable entries={visibleEntries} />
          {remainingCount > 0 ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-[#dfe7e3] bg-white px-[26px] py-3 text-[13px] font-bold text-foreground"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more entries · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}