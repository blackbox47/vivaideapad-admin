import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CreatorStat } from '@/models/creator/creator-dashboard-model';

interface CreatorStatsCardsProps {
  stats: CreatorStat[];
  isLoading: boolean;
}

export default function CreatorStatsCards({
  stats,
  isLoading,
}: CreatorStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border-subtle bg-card p-4 sm:rounded-[20px] sm:p-[22px]"
            >
              <Skeleton className="h-3.5 w-24 sm:h-4 sm:w-36" />
              <Skeleton className="mt-3.5 h-7 w-14 sm:mt-5 sm:h-9 sm:w-16" />
              <Skeleton className="mt-2.5 h-3 w-20 sm:mt-4 sm:w-24" />
            </div>
          ))
        : stats.map((stat) => (
            <article
              key={stat.id}
              className="relative flex flex-col justify-between rounded-2xl border border-border-subtle bg-card p-4 shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-brand-lime hover:shadow-lg sm:rounded-[20px] sm:p-[22px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div>
                <p className="text-[11px] font-medium text-slate-500 sm:text-[13px] dark:text-muted-foreground">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    'mt-2 font-heading font-bold sm:font-extrabold leading-none tracking-tight text-foreground sm:mt-2.5',
                    stat.valueSize === 'md'
                      ? 'text-lg sm:text-[18px]'
                      : stat.valueSize === 'lg'
                        ? 'text-xl sm:text-[26px]'
                        : 'text-xl sm:text-2xl lg:text-[32px]',
                  )}
                >
                  {stat.value}
                </p>
              </div>
              <div className="mt-1.5 sm:mt-2 min-h-[16px]">
                {stat.description ? (
                  <p
                    className={cn(
                      'text-[11px] sm:text-xs',
                      stat.tone === 'positive' && 'font-medium text-teal-600 dark:text-success',
                      stat.tone === 'danger' && 'font-medium text-destructive',
                      stat.tone === 'muted' && 'text-slate-400 dark:text-brand-sage',
                      (stat.tone === 'default' || !stat.tone) &&
                        'text-slate-400 dark:text-muted-foreground',
                    )}
                  >
                    {stat.description}
                  </p>
                ) : (
                  <span className="inline-block text-[11px] select-none opacity-0">
                    &nbsp;
                  </span>
                )}
              </div>
            </article>
          ))}
    </div>
  );
}
