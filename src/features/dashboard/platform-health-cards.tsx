import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStat } from '@/models/dashboard/dashboard-model';
import { cn } from '@/lib/utils';

interface PlatformHealthCardsProps {
  stats: DashboardStat[];
  isLoading: boolean;
}

export default function PlatformHealthCards({
  stats,
  isLoading,
}: PlatformHealthCardsProps) {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px]"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-5 h-9 w-16" />
              <Skeleton className="mt-4 h-3 w-24" />
            </div>
          ))
        : stats.map((stat) => (
            <article
              key={stat.id}
              className="relative rounded-[20px] border border-border-subtle bg-card p-[22px] shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-lime hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
              <p className="mt-3 font-heading text-[32px] leading-none font-extrabold tracking-[-0.02em] text-foreground">
                {stat.value}
              </p>
              <p
                className={cn(
                  'mt-1 text-xs text-muted-foreground',
                  stat.tone === 'danger' && 'text-destructive',
                )}
              >
                {stat.description}
              </p>
            </article>
          ))}
    </div>
  );
}
