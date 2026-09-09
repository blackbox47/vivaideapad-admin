import LoginHero from '@/features/auth/login-hero';
import LoginPanel from '@/features/auth/login-panel';

export default function CreatorLoginPage() {
  const brandName = 'sparkory';
  const eyebrow = 'WELCOME BACK';
  const title = 'Ideas grow when you show up.';
  const description = 'Continue creating, reviewing or shaping the next opportunity.';
  const footer = 'Sparkory community platform';

  return (
    <div className="flex min-h-svh w-full flex-col bg-[#f8faf9] md:h-screen md:flex-row md:overflow-hidden md:bg-surface-subtle">
      <LoginHero
        brandName={brandName}
        eyebrow={eyebrow}
        title={title}
        description={description}
        footer={footer}
      />
      <LoginPanel
        role="creator"
        brandName={brandName}
        eyebrow={eyebrow}
        heroTitle={title}
        heroDescription={description}
        footer={footer}
      />
    </div>
  );
}