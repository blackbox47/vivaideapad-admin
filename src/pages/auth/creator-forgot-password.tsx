import ForgotPasswordPanel from '@/features/auth/forgot-password-panel';
import LoginHero from '@/features/auth/login-hero';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export default function CreatorForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <LoginHero
        brandName="sparkory"
        eyebrow="WELCOME BACK"
        title="Ideas grow when you show up."
        description="Continue creating, reviewing or shaping the next opportunity."
        footer="Sparkory community platform"
        homeLink={CREATOR_ROUTES.login}
      />
      <ForgotPasswordPanel brandName="sparkory" />
    </div>
  );
}
