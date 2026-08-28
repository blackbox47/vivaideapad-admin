import { Link } from '@tanstack/react-router';

import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface LoginHeroProps {
  brandName: string;
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
}

function BrandMark() {
  return (
    <span
      className="grid size-[31px] place-items-center bg-brand-lime"
      style={{
        borderRadius: '50% 50% 50% 12%',
        transform: 'rotate(-12deg)',
      }}
      aria-hidden
    >
      <i className="block size-2 rounded-full bg-brand-pine-deep" />
    </span>
  );
}

export default function LoginHero({
  brandName,
  eyebrow,
  title,
  description,
  footer,
}: LoginHeroProps) {
  return (
    <section className="relative hidden flex-col justify-between bg-brand-pine-deep p-11 text-white lg:flex">
      <Link
        to={ADMIN_ROUTES.login}
        className="flex items-center gap-2.5 font-heading text-[22px] font-extrabold tracking-[-0.04em] text-white no-underline"
        aria-label={`${brandName} home`}
      >
        <BrandMark />
        <span>{brandName}</span>
      </Link>

      <div>
        <span className="text-[12px] font-extrabold tracking-[0.12em] text-brand-lime uppercase">
          {eyebrow}
        </span>
        <h1 className="mt-3.5 font-heading text-[44px] leading-[1.05] tracking-[-0.04em] text-white">
          {title}
        </h1>
        <p className="mt-3 text-text-light">{description}</p>
      </div>

      <small className="text-text-subtle">{footer}</small>
    </section>
  );
}
