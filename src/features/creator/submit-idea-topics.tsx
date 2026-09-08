import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CreatorTopic } from '@/models/creator/submit-idea-model';

interface SubmitIdeaTopicsProps {
  topics: CreatorTopic[];
  isLoading: boolean;
  onSelectTopic?: (topicId: string) => void;
  selectedTopicId?: string;
}

export default function SubmitIdeaTopics({
  topics,
  isLoading,
  onSelectTopic,
  selectedTopicId,
}: SubmitIdeaTopicsProps) {
  return (
    <section className="mb-10 sm:mb-12" data-purpose="topic-picker-section">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Browse active topics
        </h2>
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
          Tap a topic to fill in the form below
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <article
                key={index}
                className="flex min-h-[145px] flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
              >
                <div>
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-2.5 h-3.5 w-full" />
                  <Skeleton className="mt-1.5 h-3.5 w-4/5" />
                </div>
                <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              </article>
            ))
          : topics.map((topic) => {
              const isActive = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic?.(topic.id)}
                  className={cn(
                    'group relative flex min-h-[145px] flex-col justify-between rounded-2xl border bg-card p-5 sm:p-6 text-left shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md',
                    isActive
                      ? 'border-primary ring-2 ring-primary/20 shadow-md bg-secondary/15'
                      : 'border-border hover:border-brand-forest/80',
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        'mb-1 text-base sm:text-lg font-bold text-foreground transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'group-hover:text-brand-forest',
                      )}
                    >
                      {topic.title}
                    </div>
                    <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-3">
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {topic.reward}
                    </span>
                    <span className="text-xs font-medium lowercase tracking-wide text-muted-foreground">
                      closes {topic.closesOn}
                    </span>
                  </div>
                </button>
              );
            })}
      </div>
    </section>
  );
}