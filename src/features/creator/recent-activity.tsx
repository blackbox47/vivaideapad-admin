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
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <h2 className="mb-5 font-heading text-lg font-semibold text-foreground">
        Recent activity
      </h2>

      {isLoading ? (
        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 border-t border-border-muted py-3 first:border-t-0 first:pt-0">
              <Skeleton className="size-9 shrink-0 rounded-[10px]" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-52" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 border-t border-border-muted py-3 first:border-t-0 first:pt-0"
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-subtle text-sm"
                aria-hidden
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
