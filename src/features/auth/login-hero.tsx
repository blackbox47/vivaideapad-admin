import { Link } from '@tanstack/react-router';

import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface LoginHeroProps {
  brandName?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  footer?: string;
  homeLink?: string;
}

function BrandMark() {
  return (
    <div
      className="flex size-10 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-primary"
      aria-hidden
    >
      <div className="size-3 rounded-full bg-white" />
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
}: LoginHeroProps) {
  return (
    <section className="relative hidden w-full flex-col justify-between overflow-hidden border-r border-border bg-secondary p-8 font-sans text-foreground md:flex md:w-1/2 md:p-12 lg:p-14">
      <div className="z-10 flex items-center gap-3">
        <Link
          to={homeLink}
          className="flex items-center gap-3 text-foreground no-underline transition-opacity hover:opacity-90"
          aria-label={`${brandName} home`}
        >
          <BrandMark />
          <span className="text-xl font-bold tracking-tight">{brandName}</span>
        </Link>
      </div>

      <div className="z-10 my-auto max-w-md py-12">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wider text-primary uppercase">
          <span className="size-2 rounded-full bg-primary" />
          <span>{eyebrow}</span>
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          {description}
        </p>
      </div>

      <div className="z-10">
        <p className="text-xs text-muted-foreground">{footer}</p>
      </div>

      <div
        className="pointer-events-none absolute right-0 bottom-0 size-72 rounded-full bg-primary/15 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-16 left-10 size-40 rounded-full bg-[#36a4ff]/20 blur-[90px]"
        aria-hidden
      />
    </section>
  );
}
