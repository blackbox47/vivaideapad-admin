import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Concept } from '@/models/topics/topics-model';
import { cn } from '@/lib/utils';
import { formatDisplayDate } from '@/utils/helpers/format-display-date';

const STATUS_STYLES: Record<Concept['status'], string> = {
  active: 'bg-success-subtle text-success',
  draft: 'bg-info-subtle text-info',
  archived: 'bg-surface-muted text-muted-foreground',
};

interface ConceptCardProps {
  concept: Concept;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onEdit?: (concept: Concept) => void;
}

export default function ConceptCard({
  concept,
  isSelected = false,
  onToggleSelect,
  onEdit,
}: ConceptCardProps) {
  return (
    <article
      data-purpose={isSelected ? 'concept-card-selected' : 'concept-card'}
      className={cn(
        'group relative rounded-[20px] p-5.5 transition-[transform,box-shadow,border-color,background-color] duration-200 flex flex-col justify-between',
        isSelected
          ? 'border-2 border-primary bg-primary/5 shadow-md'
          : 'border border-border bg-card hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      {isSelected ? (
        <div className="absolute -top-2.5 right-6 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary-foreground shadow-xs">
          <Check className="size-2.5 stroke-[3] text-primary-foreground" />
          <span>Selected</span>
        </div>
      ) : null}

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              aria-label={`Select card ${concept.title}`}
              checked={isSelected}
              onChange={() => onToggleSelect?.(concept.id)}
              className={cn(
                'size-4 cursor-pointer rounded accent-primary transition',
                isSelected
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border text-primary focus:ring-primary/40',
              )}
            />
            <span
              className={cn(
                'grid size-8.5 place-items-center rounded-full text-base leading-none transition-colors',
                isSelected
                  ? 'bg-primary/15 text-primary'
                  : 'bg-surface-subtle text-foreground',
              )}
            >
              {concept.icon}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {concept.isOnboarding ? (
              <span className="inline-flex items-center rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                NEW
              </span>
            ) : null}
            <span
              className={cn(
                'rounded-full px-2.75 py-1 text-[11px] font-bold capitalize',
                STATUS_STYLES[concept.status],
              )}
            >
              {concept.status}
            </span>
          </div>
        </div>

        <p className="mt-3.5 text-[11px] font-extrabold tracking-widest text-brand-sage uppercase">
          {concept.category}
        </p>
        <h2 className="mt-1.5 line-clamp-1 font-heading text-lg font-semibold text-foreground">
          {concept.title}
        </h2>
        <p className="mt-1 mb-3 line-clamp-2 text-[13px] leading-normal text-muted-foreground">
          {concept.description}
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Opens {formatDisplayDate(concept.opensOn)} · Closes{' '}
          {formatDisplayDate(concept.closesOn)} ·{' '}
          <strong className="text-foreground">{concept.reward}</strong>
        </p>
      </div>

      <div className="mt-auto flex justify-end pt-1">
        <Button
          type="button"
          onClick={() => onEdit?.(concept)}
          className="h-auto cursor-pointer rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/80"
        >
          Edit concept
        </Button>
      </div>
    </article>
  );
}
