import AdminSignInPanel from '@/features/auth/admin-sign-in-panel';
import LoginHero from '@/features/auth/login-hero';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <LoginHero
        brandName="sparkory"
        eyebrow="ADMIN PORTAL"
        title="Manage, review, and govern with confidence."
        description="Secure portal for Sparkory platform owners, reviewers, and system administrators."
        footer="Sparkory community platform"
        homeLink={CREATOR_ROUTES.login}
      />
      <AdminSignInPanel brandName="sparkory" />
    </div>
  );
}