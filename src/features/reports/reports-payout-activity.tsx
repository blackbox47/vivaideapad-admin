import { Skeleton } from '@/components/ui/skeleton';
import type { ReportsPayoutSummary } from '@/models/reports/reports-model';

interface ReportsPayoutActivityProps {
  summary: ReportsPayoutSummary;
  isLoading: boolean;
}

interface ActivityRow {
  id: string;
  label: string;
  value: string;
}

export default function ReportsPayoutActivity({
  summary,
  isLoading,
}: ReportsPayoutActivityProps) {
  const rows: ActivityRow[] = [
    {
      id: 'paid_this_month',
      label: 'Paid out to date',
      value: summary.paidThisMonth,
    },
    {
      id: 'pending',
      label: 'Pending requests',
      value: String(summary.pendingRequests),
    },
    {
      id: 'avg_processing',
      label: 'Average processing time',
      value: `${summary.averageProcessingDays} days`,
    },
    {
      id: 'paid_contributors',
      label: 'Total paid contributors',
      value: String(summary.totalPaidContributors),
    },
  ];

  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
        Payout activity
      </h2>

      <div className="mt-3.5 flex flex-col gap-3">
        {isLoading
          ? rows.map((row) => (
              <div
                key={row.id}
                className="flex justify-between text-sm"
              >
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : rows.map((row) => (
              <div
                key={row.id}
                className="flex justify-between text-sm"
              >
                <span className="text-[#687773]">{row.label}</span>
                <strong className="text-foreground">{row.value}</strong>
              </div>
            ))}
      </div>
    </section>
  );
}