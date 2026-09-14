import LoginHero from '@/features/auth/login-hero';
import ResetPasswordPanel from '@/features/auth/reset-password-panel';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface CreatorResetPasswordPageProps {
  token: string;
}

export default function CreatorResetPasswordPage({
  token,
}: CreatorResetPasswordPageProps) {
  return (
    <div className="flex min-h-svh w-full flex-col overflow-hidden md:h-screen md:flex-row">
      <LoginHero
        brandName="Viva IdeaPad"
        eyebrow="WELCOME BACK"
        title="Ideas grow when you show up."
        description="Continue creating, reviewing or shaping the next opportunity."
        footer="Viva IdeaPad community platform"
        homeLink={CREATOR_ROUTES.login}
      />
      <ResetPasswordPanel token={token} brandName="Viva IdeaPad" />
    </div>
  );
}
