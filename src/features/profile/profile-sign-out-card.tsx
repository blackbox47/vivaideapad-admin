import { Button } from '@/components/ui/button';

interface ProfileSignOutCardProps {
  onSignOut: () => void;
}

export default function ProfileSignOutCard({
  onSignOut,
}: ProfileSignOutCardProps) {
  return (
    <section className="rounded-[20px] bg-warning-subtle p-[22px] border border-warning-subtle">
      <h3 className="mb-2.5 font-heading text-base font-semibold text-warning">
        Sign out
      </h3>
      <p className="mb-3.5 text-[13px] text-warning">
        End this session on this device.
      </p>
      <Button
        type="button"
        onClick={onSignOut}
        className="h-auto rounded-full bg-primary px-[18px] py-[11px] text-[13px] font-bold text-primary-foreground hover:bg-brand-forest"
      >
        Sign out
      </Button>
    </section>
  );
}