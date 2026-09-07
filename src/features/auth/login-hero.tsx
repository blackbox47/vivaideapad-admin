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
      className="flex size-10 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-brand-lime"
      aria-hidden
    >
      <div className="size-3 rounded-full bg-brand-pine-deep" />
    </div>
  );
}

export default function LoginHero({
  brandName = 'sparkory',
  eyebrow = 'WELCOME BACK',
  title = 'Ideas grow when you show up.',
  description = 'Continue creating, reviewing or shaping the next opportunity.',
  footer = 'Sparkory community platform',
  homeLink = CREATOR_ROUTES.login,
}: LoginHeroProps) {
  return (
    <section className="relative hidden w-full flex-col justify-between overflow-hidden bg-brand-pine-deep p-8 font-jakarta text-white md:flex md:w-1/2 md:p-12 lg:p-14">
      {/* Top Brand / Logo */}
      <div className="z-10 flex items-center gap-3">
        <Link
          to={homeLink}
          className="flex items-center gap-3 text-white no-underline transition-opacity hover:opacity-90"
          aria-label={`${brandName} home`}
        >
          <BrandMark />
          <span className="text-xl font-bold tracking-tight lowercase">
            {brandName}
          </span>
        </Link>
      </div>

      {/* Main Hero Content */}
      <div className="z-10 my-auto max-w-md py-12">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wider text-brand-lime uppercase">
          <span className="size-2 rounded-full bg-brand-lime" />
          <span>{eyebrow}</span>
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-text-light md:text-xl">
          {description}
        </p>
      </div>

      {/* Footer Notice */}
      <div className="z-10">
        <p className="text-xs text-text-light/70">{footer}</p>
      </div>

      {/* Abstract Ambient Glow Decoration */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 size-72 rounded-full bg-brand-lime opacity-10 blur-[130px]"
        aria-hidden
      />
    </section>
  );
}

