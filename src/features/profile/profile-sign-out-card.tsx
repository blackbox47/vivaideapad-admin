import { Button } from '@/components/ui/button';
import AccordionSection from '@/components/shared/accordion-section';

interface ProfileSignOutCardProps {
  onSignOut: () => void;
  isSigningOut?: boolean;
}

export default function ProfileSignOutCard({
  onSignOut,
  isSigningOut,
}: ProfileSignOutCardProps) {
  return (
    <section className="rounded-[20px] bg-warning-subtle p-[22px] border border-warning-subtle">
      <AccordionSection title="Sign out" titleClassName="text-warning">
        <p className="mb-3.5 text-[13px] text-warning">
          End this session on this device.
        </p>
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onSignOut}
          disabled={isSigningOut}
          loading={isSigningOut}
          className="h-auto rounded-full bg-primary px-[18px] py-[11px] text-[13px] font-bold text-primary-foreground hover:bg-brand-forest"
        >
          Sign out
        </Button>
        </div>
      </AccordionSection>
    </section>
  );
}