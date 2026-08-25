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
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-[#e3e9e6] bg-white p-[22px]"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-5 h-9 w-16" />
              <Skeleton className="mt-4 h-3 w-24" />
            </div>
          ))
        : stats.map((stat) => (
            <article
              key={stat.id}
              className="relative rounded-[20px] border border-[#e3e9e6] bg-white p-[22px] shadow-[0_1px_3px_rgba(18,35,31,0.05)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#c9f36d] hover:shadow-[0_16px_32px_rgba(18,35,31,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-[13px] text-[#687773]">{stat.label}</p>
              <p
                className={cn(
                  'mt-2.5 font-heading leading-none font-extrabold tracking-[-0.02em] text-foreground',
                  stat.valueSize === 'md'
                    ? 'text-[18px]'
                    : stat.valueSize === 'lg'
                      ? 'text-[26px]'
                      : 'text-[32px]',
                )}
              >
                {stat.value}
              </p>
              {stat.description ? (
                <p
                  className={cn(
                    'mt-1 text-xs',
                    stat.tone === 'positive' && 'text-[#16805e]',
                    stat.tone === 'danger' && 'text-[#b3401f]',
                    stat.tone === 'muted' && 'text-[#527065]',
                    (stat.tone === 'default' || !stat.tone) && 'text-[#687773]',
                  )}
                >
                  {stat.description}
                </p>
              ) : null}
            </article>
          ))}
    </div>
  );
}
