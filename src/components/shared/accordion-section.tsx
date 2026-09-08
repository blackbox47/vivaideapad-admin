import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  className?: string;
}

export default function AccordionSection({
  title,
  children,
  defaultOpen = false,
  titleClassName,
  className,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const headerId = useId();
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      >
        <h3
          className={cn(
            'font-heading text-base font-semibold text-foreground',
            titleClassName,
          )}
        >
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'pt-3.5 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              isOpen ? 'opacity-100' : 'opacity-0',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
