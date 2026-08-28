import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import type { CreatorTopic } from '@/models/creator/submit-idea-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface OpportunityCardProps {
  topic: CreatorTopic;
}

export default function OpportunityCard({ topic }: OpportunityCardProps) {
  return (
    <article className="flex flex-col rounded-[22px] border border-border bg-card p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <span className="grid size-11 place-items-center rounded-xl bg-surface-subtle text-[19px] leading-none">
        {topic.icon}
      </span>
      <p className="mt-4 text-[12px] font-extrabold tracking-[0.1em] text-brand-sage uppercase">
        {topic.category}
      </p>
      <h2 className="mt-2.5 font-heading text-[19px] leading-snug font-semibold text-foreground">
        {topic.title}
      </h2>
      <p className="mt-2 mb-0 flex-1 text-sm leading-[1.6] text-muted-foreground">
        {topic.description}
      </p>
      <div className="mt-[18px] flex items-center justify-between text-[13px] text-muted-foreground">
        <span>{topic.deadline} left</span>
        <strong className="text-foreground">{topic.reward}</strong>
      </div>
      <Button
        render={<Link to={CREATOR_ROUTES.submitIdea} />}
        className="mt-4 h-auto w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-forest"
      >
        Open brief
      </Button>
    </article>
  );
}
