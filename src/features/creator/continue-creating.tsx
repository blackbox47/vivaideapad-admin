import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CreatorInProgressItem } from '@/models/creator/creator-dashboard-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface ContinueCreatingProps {
  items: CreatorInProgressItem[];
  isLoading: boolean;
}

const ICON_TONE_CLASS: Record<CreatorInProgressItem['iconTone'], string> = {
  mint: 'bg-[#dff8eb]',
  lavender: 'bg-[#e7e3ff]',
};

export default function ContinueCreating({
  items,
  isLoading,
}: ContinueCreatingProps) {
  return (
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Continue creating
        </h2>
        <Button
          render={<Link to={CREATOR_ROUTES.submissions} />}
          variant="outline"
          className="h-auto rounded-full border-[#dfe7e3] bg-white px-3.5 py-2 text-xs font-bold"
        >
          View all
        </Button>
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="mt-2.5 h-[88px] rounded-[15px]" />
          ))}
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <article
              key={item.id}
              className="mt-2.5 grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-[15px] border border-[#dfe7e3] p-3.5 first:mt-1.5"
            >
              <span
                className={cn(
                  'grid size-[58px] place-items-center rounded-[15px] text-xl leading-none',
                  ICON_TONE_CLASS[item.iconTone],
                )}
                aria-hidden
              >
                {item.icon}
              </span>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#687773]">{item.detail}</p>
                {typeof item.progress === 'number' ? (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef1ef]">
                    <span
                      className="block h-full rounded-full bg-[#c9f36d]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}
              </div>

              {item.action === 'continue' ? (
                <Button
                  render={<Link to={CREATOR_ROUTES.submitIdea} />}
                  className="h-auto rounded-full bg-[#12231f] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#254b40]"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  render={<Link to={CREATOR_ROUTES.submissions} />}
                  variant="outline"
                  className="h-auto rounded-full border-[#dfe7e3] bg-white px-3.5 py-2 text-xs font-bold"
                >
                  Review
                </Button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
