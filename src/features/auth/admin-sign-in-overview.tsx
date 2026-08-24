import AdminSignInPanel from '@/features/auth/admin-sign-in-panel';
import LoginHero from '@/features/auth/login-hero';

export default function AdminSignInOverview() {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <LoginHero
        brandName="ideapad"
        eyebrow="Admin console"
        title="Operate the Ideapad platform."
        description="Sign in with your administrator credentials to manage topics, review content, and run payouts."
        footer="Authorized personnel only"
      />
      <AdminSignInPanel />
    </div>
  );
}