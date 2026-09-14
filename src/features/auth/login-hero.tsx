import { Link } from '@tanstack/react-router';

import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { cn } from '@/lib/utils';

interface LoginHeroProps {
  brandName?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  footer?: string;
  homeLink?: string;
  className?: string;
}

function BrandMark() {
  return (
    <div
      className="flex size-8 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-primary lg:size-10"
      aria-hidden
    >
      <div className="size-2.5 rounded-full bg-white lg:size-3" />
    </div>
  );
}

export default function LoginHero({
  brandName = 'Viva IdeaPad',
  eyebrow = 'WELCOME BACK',
  title = 'Ideas grow when you show up.',
  description = 'Continue creating, reviewing or shaping the next opportunity.',
  footer = 'Viva IdeaPad community platform',
  homeLink = CREATOR_ROUTES.login,
  className,
}: LoginHeroProps) {
  return (
    <section
      className={cn(
        'relative hidden h-full min-h-0 w-full flex-col justify-between overflow-y-auto border-r border-border bg-secondary p-6 font-sans text-foreground md:flex md:w-1/2 lg:p-10 xl:p-14',
        className,
      )}
    >      <div className="z-10 flex shrink-0 items-center gap-3">
        <Link
          to={homeLink}
          className="flex items-center gap-2.5 text-foreground no-underline transition-opacity hover:opacity-90 lg:gap-3"
          aria-label={`${brandName} home`}
        >
          <BrandMark />
          <span className="text-lg font-bold tracking-tight lg:text-xl">
            {brandName}
          </span>
        </Link>
      </div>

      <div className="z-10 my-auto max-w-md py-6 lg:py-10">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase lg:mb-5 lg:text-sm">
          <span className="size-2 rounded-full bg-primary" />
          <span>{eyebrow}</span>
        </p>
        <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground lg:mb-5 lg:text-4xl xl:text-5xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground lg:text-lg xl:text-xl">
          {description}
        </p>
      </div>

      <div className="z-10 shrink-0">
        <p className="text-xs text-muted-foreground">{footer}</p>
      </div>

      <div
        className="pointer-events-none absolute right-0 bottom-0 size-56 rounded-full bg-primary/15 blur-[110px] lg:size-72 lg:blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-12 left-8 size-32 rounded-full bg-[#36a4ff]/20 blur-[80px] lg:top-16 lg:left-10 lg:size-40 lg:blur-[90px]"
        aria-hidden
      />
    </section>
  );
}
