import LoginHero from '@/features/auth/login-hero';
import LoginPanel from '@/features/auth/login-panel';

export default function CreatorLoginPage() {
  return (
    <div className="flex min-h-svh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <LoginHero
        brandName="sparkory"
        eyebrow="WELCOME BACK"
        title="Ideas grow when you show up."
        description="Continue creating, reviewing or shaping the next opportunity."
        footer="Sparkory community platform"
      />
      <LoginPanel role="creator" brandName="sparkory" />
    </div>
  );
}