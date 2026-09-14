import SignUpHero from '@/features/auth/sign-up-hero';
import VerifyEmailPanel from '@/features/auth/verify-email-panel';

interface CreatorVerifyEmailPageProps {
  token: string;
}

export default function CreatorVerifyEmailPage({
  token,
}: CreatorVerifyEmailPageProps) {
  const brandName = 'Viva IdeaPad';
  const eyebrow = 'CONTRIBUTOR ACCESS';
  const title = 'One idea opens the door.';
  const description =
    'Pick an onboarding topic, write your idea, and submit it for review. Once an admin approves it, you can sign in.';
  const footer = 'Viva IdeaPad community platform';

  return (
    <div className="flex min-h-svh w-full flex-col bg-background md:h-svh md:flex-row md:overflow-hidden">
      <SignUpHero
        brandName={brandName}
        eyebrow={eyebrow}
        title={title}
        description={description}
        footer={footer}
        className="md:w-[42%]"
      />
      <VerifyEmailPanel token={token} brandName={brandName} />
    </div>
  );
}
