import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CreatorRewardsTable from '@/features/creator/creator-rewards-table';
import CreatorStatsCards from '@/features/creator/creator-stats-cards';
import WithdrawRequestDialog from '@/features/creator/withdraw-request-dialog';
import useCreatorRewards from '@/hooks/creator/use-creator-rewards';
import type { CreatorStat } from '@/models/creator/creator-dashboard-model';
import type { CreatorRewardEntry } from '@/models/creator/creator-rewards-model';

function exportEntries(entries: CreatorRewardEntry[]) {
  const header = 'Date,Description,Type,Status,Amount';
  const rows = entries.map((entry) =>
    [
      entry.date,
      `"${entry.description.replaceAll('"', '""')}"`,
      entry.type,
      entry.status,
      entry.amount,
    ].join(','),
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const day = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `ideapad-rewards-${day}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CreatorRewardsOverview() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    requestWithdrawal,
    resetWithdraw,
    isWithdrawing,
    withdrawError,
  } = useCreatorRewards();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load rewards
          </CardTitle>
          <CardDescription>{error ?? 'Unexpected error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const stats: CreatorStat[] = [
    {
      id: 'available',
      label: 'Available',
      value: data?.available ?? '—',
      valueSize: 'lg',
    },
    {
      id: 'pending',
      label: 'Pending review',
      value: data?.pending ?? '—',
      valueSize: 'lg',
    },
    {
      id: 'paid',
      label: 'Paid to date',
      value: data?.paidToDate ?? '—',
      valueSize: 'lg',
    },
    {
      id: 'method',
      label: 'Payout method',
      value: data?.payoutMethod ?? '—',
      valueSize: 'md',
    },
  ];

  const closeWithdraw = () => {
    resetWithdraw();
    setIsWithdrawOpen(false);
  };

  const handleWithdraw = async (payload: { amount: string; method: string }) => {
    try {
      await requestWithdrawal(payload).unwrap();
      closeWithdraw();
      setToast('Withdrawal request submitted');
      window.setTimeout(() => setToast(null), 3200);
    } catch {
      // Error is surfaced via withdrawError.
    }
  };

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Rewards"
        title="Your work has value."
        description="See every reward and manage your payout requests."
        action={
          <Button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            className="h-auto rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-brand-forest"
          >
            Request withdrawal
          </Button>
        }
      />

      <CreatorStatsCards stats={stats} isLoading={isLoading} />

      <section className="mt-[18px] rounded-[20px] border border-border bg-card p-[22px]">
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Transaction history
          </h2>
          <Button
            type="button"
            variant="outline"
            disabled={!data || (data.entries ?? []).length === 0}
            onClick={() => exportEntries(data?.entries ?? [])}
            className="h-auto rounded-full border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-surface-subtle"
          >
            Export
          </Button>
        </div>
        <CreatorRewardsTable
          entries={data?.entries ?? []}
          isLoading={isLoading}
        />
      </section>

      {isWithdrawOpen ? (
        <WithdrawRequestDialog
          available={data?.available ?? '—'}
          defaultMethod={data?.payoutMethod ?? ''}
          isSubmitting={isWithdrawing}
          error={withdrawError}
          onClose={closeWithdraw}
          onSubmit={handleWithdraw}
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
