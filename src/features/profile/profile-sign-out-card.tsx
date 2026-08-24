import { Button } from '@/components/ui/button';

interface ProfileSignOutCardProps {
  onSignOut: () => void;
}

export default function ProfileSignOutCard({
  onSignOut,
}: ProfileSignOutCardProps) {
  return (
    <section className="rounded-[20px] bg-[#fff5d7] p-[22px]">
      <h3 className="mb-2.5 font-heading text-base font-semibold text-[#8a6d00]">
        Sign out
      </h3>
      <p className="mb-3.5 text-[13px] text-[#8a6d00]">
        End this session on this device.
      </p>
      <Button
        type="button"
        onClick={onSignOut}
        className="h-auto rounded-full bg-[#12231f] px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-[#254b40]"
      >
        Sign out
      </Button>
    </section>
  );
}