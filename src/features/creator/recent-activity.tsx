import EmptyState from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { CreatorActivityItem } from '@/models/creator/creator-dashboard-model';

interface RecentActivityProps {
  items: CreatorActivityItem[];
  isLoading: boolean;
}

export default function RecentActivity({
  items,
  isLoading,
}: RecentActivityProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-card p-5 shadow-xs sm:rounded-[20px] sm:p-[22px] dark:border-border">
      <h2 className="mb-4 font-heading text-sm font-semibold text-foreground sm:mb-5 sm:text-lg">
        Recent activity
      </h2>

      {isLoading ? (
        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-3 border-t border-border-muted py-3 first:border-t-0 first:pt-0"
            >
              <Skeleton className="size-7 shrink-0 rounded-lg sm:size-9 sm:rounded-[10px]" />
              <div className="flex-1">
                <Skeleton className="h-3.5 w-32 sm:h-4 sm:w-40" />
                <Skeleton className="mt-1.5 h-3 w-44 sm:mt-2 sm:w-52" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          card={false}
          size="sm"
          title="No recent activity"
          description="Activity will be logged here as you work on briefs."
        />
      ) : (
        <ul className="m-0 list-none p-0 divide-y divide-slate-100 dark:divide-border/40">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <span
                className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-subtle text-xs sm:size-9 sm:rounded-[10px] sm:text-sm"
                aria-hidden
              >
                {item.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground sm:text-[13px]">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
