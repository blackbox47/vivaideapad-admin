import { Link, useNavigate } from '@tanstack/react-router';

import EmptyState from '@/components/shared/empty-state';
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
  mint: 'bg-success-subtle text-success',
  lavender: 'bg-info-alt text-info',
};

export default function ContinueCreating({
  items,
  isLoading,
}: ContinueCreatingProps) {
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-card p-5 shadow-xs sm:rounded-[20px] sm:p-5.5 dark:border-border">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h2 className="font-heading text-sm font-semibold text-foreground sm:text-lg">
          Continue creating
        </h2>
        <Button
          render={<Link to={CREATOR_ROUTES.submissions} />}
          variant="outline"
          className="h-auto rounded-full border border-slate-200 bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-surface-subtle sm:px-3.5 sm:py-2 sm:font-bold dark:border-border"
        >
          View all
        </Button>
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="mt-2.5 h-20 rounded-xl sm:h-22 sm:rounded-[15px]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-4 sm:py-6">
          <EmptyState
            card={false}
            size="sm"
            title="No ideas in progress"
            description="Start drafting a new submission from opportunities."
          />
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <article
              key={item.id}
              className="mt-2.5 grid grid-cols-[46px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-border p-3 sm:grid-cols-[58px_minmax(0,1fr)_auto] sm:gap-3.5 sm:rounded-[15px] sm:p-3.5 first:mt-1.5"
            >
              <span
                className={cn(
                  'grid size-11.5 place-items-center rounded-xl text-lg leading-none sm:size-14.5 sm:rounded-[15px] sm:text-xl',
                  ICON_TONE_CLASS[item.iconTone],
                )}
                aria-hidden
              >
                {item.icon}
              </span>

              <div className="min-w-0">
                <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1.5 sm:text-xs">
                  {item.detail}
                </p>
                {typeof item.progress === 'number' ? (
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted sm:mt-2">
                    <span
                      className="block h-full rounded-full bg-brand-lime"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}
              </div>

              {item.action === 'continue' ? (
                <Button
                  type="button"
                  onClick={() => {
                    navigate({
                      to: `${CREATOR_ROUTES.submitIdea}?id=${encodeURIComponent(item.id)}`,
                    });
                  }}
                  className="h-auto cursor-pointer rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-brand-forest sm:px-3.5 sm:py-2"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  render={<Link to={CREATOR_ROUTES.submissions} />}
                  variant="outline"
                  className="h-auto rounded-full border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle sm:px-3.5 sm:py-2"
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
