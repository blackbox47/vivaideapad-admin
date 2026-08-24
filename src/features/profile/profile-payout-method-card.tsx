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
    <section className="rounded-[20px] border border-[#dfe7e3] bg-white p-[22px]">
      <h3 className="mb-2.5 font-heading text-base font-semibold">
        Payout method
      </h3>
      <p className="mb-3.5 text-[13px] text-[#687773]">{payoutMethod.label}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onChange}
        className="h-auto rounded-full border-[#dfe7e3] bg-white px-4 py-2.5 text-[13px] font-bold text-foreground hover:bg-[#f6f8f5]"
      >
        Change method
      </Button>
    </section>
  );
}