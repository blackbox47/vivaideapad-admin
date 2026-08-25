import { Skeleton } from '@/components/ui/skeleton';
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
    <section className="mb-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Browse active topics
        </h2>
        <p className="text-xs text-[#687773]">
          Tap a topic to fill in the form below
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="rounded-[16px] border border-[#e3e9e6] bg-white p-4"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-3/4" />
                <Skeleton className="mt-4 h-4 w-16" />
              </article>
            ))
          : topics.map((topic) => {
              const isActive = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic?.(topic.id)}
                  className={
                    'rounded-[16px] border bg-white p-4 text-left transition-colors ' +
                    (isActive
                      ? 'border-[#12231f] ring-2 ring-[#c9f36d]'
                      : 'border-[#e3e9e6] hover:border-[#c9f36d]')
                  }
                >
                  <p className="text-[13px] font-semibold text-foreground">
                    {topic.title}
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-xs text-[#687773]">
                    {topic.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">
                      {topic.reward}
                    </span>
                    <span className="text-[#9aa8a3]">
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