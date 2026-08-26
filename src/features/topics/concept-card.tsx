import { Button } from '@/components/ui/button';
import type { Concept } from '@/models/topics/topics-model';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<Concept['status'], string> = {
  active: 'bg-success-subtle text-success',
  draft: 'bg-info-alt text-info',
  scheduled: 'bg-info-alt text-info',
  archived: 'bg-surface-muted text-muted-foreground',
};

interface ConceptCardProps {
  concept: Concept;
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <article className="rounded-[20px] border border-border bg-card p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <span className="grid size-[42px] place-items-center rounded-xl bg-surface-subtle text-lg leading-none">
          {concept.icon}
        </span>
        <span
          className={cn(
            'rounded-full px-[11px] py-[5px] text-[11px] font-bold',
            STATUS_STYLES[concept.status],
          )}
        >
          {concept.status.charAt(0).toUpperCase() + concept.status.slice(1)}
        </span>
      </div>

      <p className="mt-3.5 text-[11px] font-extrabold tracking-[0.1em] text-brand-sage uppercase">
        {concept.category}
      </p>
      <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">
        {concept.title}
      </h2>
      <p className="mt-0 mb-3 text-[13px] leading-[1.5] text-muted-foreground">
        {concept.description}
      </p>
      <p className="mb-3.5 text-xs text-muted-foreground">
        Opens {concept.opensOn} · Closes {concept.closesOn} ·{' '}
        <strong className="text-foreground">{concept.reward}</strong>
      </p>

      <Button
        variant="outline"
        className="h-auto w-full rounded-full border-border bg-card py-2.5 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
      >
        Edit concept
      </Button>
    </article>
  );
}
