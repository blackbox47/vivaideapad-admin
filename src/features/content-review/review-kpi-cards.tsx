import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReviewKpi {
  id: string;
  label: string;
  value: number;
  tone?: 'default' | 'danger';
}

interface ReviewKpiCardsProps {
  items: ReviewKpi[];
  isLoading: boolean;
}

export default function ReviewKpiCards({ items, isLoading }: ReviewKpiCardsProps) {
  return (
    <div className="mb-6 grid gap-6 sm:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-9 w-12" />
            </div>
          ))
        : items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p
                className={cn(
                  'mt-2 text-3xl font-extrabold text-slate-900',
                  item.tone === 'danger' && 'text-red-500',
                )}
              >
                {item.value}
              </p>
            </article>
          ))}
    </div>
  );
}
