import SignUpHero from '@/features/auth/sign-up-hero';
import SignUpPanel from '@/features/auth/sign-up-panel';

export default function CreatorSignUpPage() {
  const brandName = 'Viva IdeaPad';
  const eyebrow = 'CONTRIBUTOR ACCESS';
  const title = 'Turn your ideas into rewarded impact.';
  const description =
    'Join writers, creators, and thinkers sharing original perspectives and earning rewards for every accepted concept.';
  const footer = 'Viva IdeaPad community platform';

  return (
    <div className="flex min-h-svh w-full flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      <SignUpHero
        brandName={brandName}
        eyebrow={eyebrow}
        title={title}
        description={description}
        footer={footer}
      />
      <SignUpPanel
        brandName={brandName}
        eyebrow={eyebrow}
        heroTitle={title}
        heroDescription={description}
        footer={footer}
      />
    </div>
  );
}
