import { Diamond } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReviewQueueItem } from '@/models/dashboard/dashboard-model';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface ReviewQueueProps {
  items: ReviewQueueItem[];
  isLoading: boolean;
}

export default function ReviewQueue({ items, isLoading }: ReviewQueueProps) {
  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Review queue
        </h2>
        <Button
          render={<Link to={ADMIN_ROUTES.contentReview} />}
          variant="outline"
          className="h-auto rounded-full border-[#dfe7e3] bg-white px-3.5 py-2 text-xs font-bold"
        >
          View all
        </Button>
      </div>

      <div>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="mt-2 h-[86px] rounded-[15px]" />
            ))
          : items.map((item) => (
              <article
                key={item.id}
                className="mt-2 grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[15px] border border-[#dfe7e3] p-3.5"
              >
                <div className="grid size-[58px] place-items-center rounded-[15px] bg-[#f1f3f2] text-lg text-[#687773]">
                  <Diamond className="size-[18px]" strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#687773]">
                    {item.author} · AI risk: {item.risk}
                  </p>
                </div>

                <Button
                  render={<Link to={ADMIN_ROUTES.contentReview} />}
                  className="h-auto rounded-full bg-[#12231f] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#254b40]"
                >
                  Review
                </Button>
              </article>
            ))}
      </div>
    </section>
  );
}
