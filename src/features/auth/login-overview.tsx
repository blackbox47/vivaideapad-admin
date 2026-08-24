import LoginHero from '@/features/auth/login-hero';
import LoginPanel from '@/features/auth/login-panel';

export default function LoginOverview() {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <LoginHero
        brandName="ideapad"
        eyebrow="Welcome back"
        title="Ideas grow when you show up."
        description="Continue creating, reviewing or shaping the next opportunity."
        footer="Ideapad community platform"
      />
      <LoginPanel />
    </div>
  );
}
