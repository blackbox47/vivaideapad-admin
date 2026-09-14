import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';
import { CURRENCY_SYMBOL } from '@/utils/constants';
import type { PublicConceptItem } from '@/services/applications/applications-service';

interface OnboardingTopicCardsProps {
  topics: PublicConceptItem[];
  isLoading: boolean;
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

function formatReward(budget?: string): string {
  if (!budget) return `${CURRENCY_SYMBOL}0`;
  const cleaned = String(budget).replace(/^[৳$Tk\s]*/, '');
  return `${CURRENCY_SYMBOL}${cleaned}`;
}

export default function OnboardingTopicCards({
  topics,
  isLoading,
  selectedTopicId,
  onSelectTopic,
}: OnboardingTopicCardsProps) {
  return (
    <section className="space-y-3" data-purpose="onboarding-topic-picker">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          Choose an onboarding topic
        </h2>
        <span className="text-xs text-muted-foreground">
          Tap a card, then write your idea below
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <article
                key={index}
                className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-xs"
              >
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-2 h-3 w-full" />
                  <Skeleton className="mt-1.5 h-3 w-4/5" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </article>
            ))
          : topics.map((topic) => {
              const isActive = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className={cn(
                    'group flex min-h-[120px] flex-col justify-between rounded-2xl border bg-card p-4 text-left shadow-xs transition-all duration-200 hover:shadow-md',
                    isActive
                      ? 'border-primary bg-secondary/15 ring-2 ring-primary/20 shadow-md'
                      : 'border-border hover:border-brand-forest/80',
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        'mb-1 text-sm font-bold text-foreground transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'group-hover:text-brand-forest',
                      )}
                    >
                      {topic.title}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {topic.brief || 'No brief provided for this topic.'}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-bold text-foreground">
                      {formatReward(topic.reward_budget)}
                    </span>
                    <span className="text-[11px] font-medium lowercase tracking-wide text-muted-foreground">
                      {topic.close_date
                        ? `closes ${formatDisplayDate(topic.close_date)}`
                        : 'open topic'}
                    </span>
                  </div>
                </button>
              );
            })}
      </div>
    </section>
  );
}
