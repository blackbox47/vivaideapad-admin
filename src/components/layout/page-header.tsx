import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <section className="mb-5 mt-[18px] flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1.5 font-heading text-display font-extrabold tracking-display text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-base text-[#687773]">{description}</p>
        ) : null}
      </div>
      {action}
    </section>
  );
}
