import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardKpi {
  id: string;
  label: string;
  value: string;
}

interface LeaderboardKpiCardsProps {
  items: LeaderboardKpi[];
  isLoading: boolean;
}

export default function LeaderboardKpiCards({
  items,
  isLoading,
}: LeaderboardKpiCardsProps) {
  return (
    <div className="mb-5 grid gap-3.5 sm:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px]"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-5 h-9 w-20" />
            </div>
          ))
        : items.map((item) => (
            <article
              key={item.id}
              className="rounded-[20px] border border-border-subtle bg-card p-[22px]"
            >
              <p className="text-[13px] text-muted-foreground">{item.label}</p>
              <p className="mt-3 font-heading text-[32px] leading-none font-extrabold tracking-[-0.02em] text-foreground">
                {item.value}
              </p>
            </article>
          ))}
    </div>
  );
}