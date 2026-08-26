import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/shared/status-badge';
import type { ReportsQualityRow } from '@/models/reports/reports-model';

interface ReportsQualityBreakdownProps {
  rows: ReportsQualityRow[];
  isLoading: boolean;
}

export default function ReportsQualityBreakdown({
  rows,
  isLoading,
}: ReportsQualityBreakdownProps) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <h2 className="mb-3.5 font-heading text-lg font-semibold text-foreground">
        Content review breakdown
      </h2>

      <div className="flex flex-col gap-2.5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))
          : rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between"
              >
                <StatusBadge status={row.status} />
                <strong className="text-foreground">{row.count}</strong>
              </div>
            ))}
      </div>
    </section>
  );
}