import { Button } from '@/components/ui/button';
import type { Concept } from '@/models/topics/topics-model';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<Concept['status'], string> = {
  active: 'bg-[#dff8eb] text-[#16805e]',
  draft: 'bg-[#e7e3ff] text-[#5b4fc4]',
  scheduled: 'bg-[#e7e3ff] text-[#5b4fc4]',
  archived: 'bg-[#eef1ef] text-[#687773]',
};

interface ConceptCardProps {
  concept: Concept;
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <article className="rounded-[20px] border border-[#dfe7e3] bg-white p-5 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(23,63,51,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <span className="grid size-[42px] place-items-center rounded-xl bg-[#f1f3f2] text-lg leading-none">
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

      <p className="mt-3.5 text-[11px] font-extrabold tracking-[0.1em] text-[#527065] uppercase">
        {concept.category}
      </p>
      <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">
        {concept.title}
      </h2>
      <p className="mt-0 mb-3 text-[13px] leading-[1.5] text-[#687773]">
        {concept.description}
      </p>
      <p className="mb-3.5 text-xs text-[#687773]">
        Opens {concept.opensOn} · Closes {concept.closesOn} ·{' '}
        <strong className="text-foreground">{concept.reward}</strong>
      </p>

      <Button
        variant="outline"
        className="h-auto w-full rounded-full border-[#dfe7e3] bg-white py-2.5 text-[13px] font-bold text-foreground"
      >
        Edit concept
      </Button>
    </article>
  );
}
