import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <section className="mb-5 sm:mb-6 mt-3 sm:mt-[18px] flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-display font-bold sm:font-extrabold tracking-tight md:tracking-display text-foreground leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </section>
  );
}
