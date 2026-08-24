import { Skeleton } from '@/components/ui/skeleton';
import type { ApprovalTrendItem } from '@/models/dashboard/dashboard-model';
import { cn } from '@/lib/utils';

interface ApprovalTrendProps {
  items: ApprovalTrendItem[];
  total: number;
  dailyAverage: number;
  bestDay: string;
  isLoading: boolean;
}

export default function ApprovalTrend({
  items,
  total,
  dailyAverage,
  bestDay,
  isLoading,
}: ApprovalTrendProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Approval trend
      </h2>

      {isLoading ? (
        <Skeleton className="mt-1 h-4 w-48" />
      ) : (
        <div className="mb-1.5 flex gap-4 text-xs text-[#687773]">
          <span>
            Total:{' '}
            <strong className="text-foreground">{total}</strong>
          </span>
          <span>
            Avg/day:{' '}
            <strong className="text-foreground">{dailyAverage}</strong>
          </span>
          <span>
            Best:{' '}
            <strong className="text-foreground">{bestDay}</strong>
          </span>
        </div>
      )}

      <div className="flex h-[150px] items-end gap-2.5 pt-5">
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 min-w-5 flex-1 rounded-t-lg"
              />
            ))
          : items.map((item, index) => (
              <div
                key={`${item.day}-${index}`}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                <small className="mb-1 text-[11px] text-[#687773]">
                  {item.total}
                </small>
                <div
                  className={cn(
                    'w-full rounded-t-lg rounded-b-sm bg-[#dfe8e4]',
                    item.highlight && 'bg-[#c9f36d]',
                  )}
                  style={{
                    height: `${Math.max((item.value / maxValue) * 90, 8)}%`,
                  }}
                />
                <small className="mt-1.5 block text-center text-[#687773]">
                  {item.day}
                </small>
              </div>
            ))}
      </div>
    </section>
  );
}
