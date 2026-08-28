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
import PayoutFilters, {
  parsePayoutStatus,
} from '@/features/payouts/payout-filters';
import PayoutKpiCards from '@/features/payouts/payout-kpi-cards';
import PayoutProcessPanel from '@/features/payouts/payout-process-panel';
import PayoutTable from '@/features/payouts/payout-table';
import usePayouts from '@/hooks/payouts/use-payouts';
import type {
  PayoutStatus,
} from '@/models/payouts/payouts-model';

const PAGE_SIZE = 6;

export default function PayoutsOverview() {
  const [searchParams, setSearchParams] = useTanstackSearchParams();
  const status = parsePayoutStatus(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [processId, setProcessId] = useState<string | null>(null);

  const {
    filtered,
    totalCount,
    awaitingCount,
    awaitingTotal,
    paidCount,
    isLoading,
    isError,
    error,
    refetch,
    decidePayout,
    isDeciding,
  } = usePayouts({ status, search });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
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

  const visible = filtered.slice(0, visibleCount);
  const remainingCount = Math.max(0, filtered.length - visibleCount);
  const processing = filtered.find((item) => item.id === processId);

  const handleDecide = (
    nextStatus: Extract<PayoutStatus, 'Paid' | 'Rejected'>,
    note: string,
  ) => {
    if (!processId) {
      return;
    }

    void decidePayout({ id: processId, status: nextStatus, note })
      .unwrap()
      .then(() => {
        setProcessId(null);
      })
      .catch(() => undefined);
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load payouts
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
        eyebrow="Administration"
        title="Payouts"
        description="Approve and record contributor withdrawal requests."
      />

      <PayoutKpiCards
        isLoading={isLoading}
        items={[
          { id: 'total', label: 'Total requests', value: String(totalCount) },
          {
            id: 'awaiting',
            label: 'Awaiting action',
            value: String(awaitingCount),
            helper: `${awaitingTotal} pending`,
            tone: 'success',
          },
          {
            id: 'paid',
            label: 'Paid out',
            value: String(paidCount),
          },
        ]}
      />

      {isLoading ? null : (
        <PayoutFilters
          status={status}
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
      ) : filtered.length === 0 ? (
        <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
          <span className="mb-2.5 block text-[28px]">◇</span>
          <strong className="mb-1 block text-foreground">
            No payouts match
          </strong>
          <span className="text-[13px]">
            Try a different keyword or status filter.
          </span>
        </div>
      ) : (
        <>
          <PayoutTable payouts={visible} onProcess={setProcessId} />
          {remainingCount > 0 ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-border bg-card px-[26px] py-3 text-[13px] font-bold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more requests · {remainingCount} remaining
              </button>
            </div>
          ) : null}
        </>
      )}

      {processing ? (
        <PayoutProcessPanel
          payout={processing}
          isDeciding={isDeciding}
          onClose={() => setProcessId(null)}
          onDecide={handleDecide}
        />
      ) : null}
    </div>
  );
}