import { Button } from '@/components/ui/button';
import type { PayoutMethod } from '@/models/profile/profile-model';

interface ProfilePayoutMethodCardProps {
  payoutMethod: PayoutMethod;
  onChange: () => void;
}

export default function ProfilePayoutMethodCard({
  payoutMethod,
  onChange,
}: ProfilePayoutMethodCardProps) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-[22px]">
      <h3 className="mb-2.5 font-heading text-base font-semibold text-foreground">
        Payout method
      </h3>
      <p className="mb-3.5 text-[13px] text-muted-foreground">{payoutMethod.label}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onChange}
        className="h-auto rounded-full border-border bg-card px-4 py-2.5 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
      >
        Change method
      </Button>
    </section>
  );
}