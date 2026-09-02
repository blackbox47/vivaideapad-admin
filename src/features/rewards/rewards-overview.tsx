import { useMemo, useState } from 'react';
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
import BalanceAdjustmentDialog from '@/features/rewards/balance-adjustment-dialog';
import RewardFilters, {
  parseRewardType,
} from '@/features/rewards/reward-filters';
import RewardKpiCards from '@/features/rewards/reward-kpi-cards';
import RewardTable from '@/features/rewards/reward-table';
import useCreateAdjustment from '@/hooks/rewards/use-create-adjustment';
import useRewards from '@/hooks/rewards/use-rewards';
import type { CreateAdjustmentBody } from '@/models/rewards/rewards-model';
import { DEFAULT_PAGE_SIZE as PAGE_SIZE } from '@/utils/constants/pagination';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export default function RewardsOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const type = parseRewardType(searchParams.get('type'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useResetStateOnChange(PAGE_SIZE, [
    type,
    search,
  ]);

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
  const [createAdjustment, createState] = useCreateAdjustment();
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const contributors = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.contributor))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [entries]);

  const closeAdjustment = () => {
    createState.reset();
    setIsAdjustOpen(false);
  };

  const handleCreateAdjustment = async (body: CreateAdjustmentBody) => {
    try {
      await createAdjustment(body).unwrap();
      closeAdjustment();
      setToast('Adjustment recorded');
      window.setTimeout(() => setToast(null), 3200);
    } catch {
      // Error is surfaced via createState.error.
    }
  };

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
          <Button
            type="button"
            onClick={() => setIsAdjustOpen(true)}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
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
        <div className="overflow-hidden rounded-[18px] border border-border bg-card p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-15 text-center text-muted-foreground">
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
                className="rounded-full border border-border bg-card px-6.5 py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more entries · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}

      {isAdjustOpen ? (
        <BalanceAdjustmentDialog
          contributors={contributors}
          isSubmitting={createState.isLoading}
          error={getApiErrorMessage(createState.error)}
          onClose={closeAdjustment}
          onSubmit={handleCreateAdjustment}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6.5 left-1/2 z-60 -translate-x-1/2 rounded-full bg-primary px-5.5 py-3.5 text-[13px] font-semibold text-primary-foreground shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}