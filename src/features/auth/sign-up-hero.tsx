import LoginHero from '@/features/auth/login-hero';

interface SignUpHeroProps {
  brandName?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  footer?: string;
  homeLink?: string;
}

export default function SignUpHero({
  brandName = 'Viva IdeaPad',
  eyebrow = 'CONTRIBUTOR ACCESS',
  title = 'Turn your ideas into rewarded impact.',
  description = 'Join writers, creators, and thinkers sharing original perspectives and earning rewards for every accepted concept.',
  footer = 'Viva IdeaPad community platform',
  homeLink = '/',
}: SignUpHeroProps) {
  return (
    <LoginHero
      brandName={brandName}
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={footer}
      homeLink={homeLink}
    />
  );
}
