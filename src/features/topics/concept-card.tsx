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
          ? 'border-2 border-[#3cd070] bg-[#f6fcf8] shadow-md dark:bg-[#0d221b]/40'
          : 'border border-border bg-card hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      {isSelected ? (
        <div className="absolute -top-2.5 right-6 flex items-center gap-1 rounded-full bg-[#0d221b] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-xs z-10">
          <Check className="size-2.5 text-[#3cd070] stroke-[3]" />
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
                'size-4 rounded transition cursor-pointer accent-[#0d221b]',
                isSelected
                  ? 'border-emerald-500 ring-1 ring-emerald-500'
                  : 'border-border text-primary focus:ring-emerald-600',
              )}
            />
            <span
              className={cn(
                'grid size-8.5 place-items-center rounded-full text-base leading-none transition-colors',
                isSelected
                  ? 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-surface-subtle text-foreground',
              )}
            >
              {concept.icon}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {concept.isOnboarding ? (
              <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
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
        <h2 className="mt-1.5 font-heading text-lg font-semibold text-foreground line-clamp-1">
          {concept.title}
        </h2>
        <p className="mt-1 mb-3 text-[13px] leading-normal text-muted-foreground line-clamp-2">
          {concept.description}
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Opens {formatDisplayDate(concept.opensOn)} · Closes{' '}
          {formatDisplayDate(concept.closesOn)} ·{' '}
          <strong className="text-foreground">{concept.reward}</strong>
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => onEdit?.(concept)}
        className="h-auto w-full rounded-full border-border bg-card py-2.5 text-[13px] font-bold text-foreground hover:bg-surface-subtle cursor-pointer transition shadow-2xs"
      >
        Edit concept
      </Button>
    </article>
  );
}
