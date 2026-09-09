import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useRecalculateRankingsMutation } from '@/services/leaderboard/leaderboard-service';

export default function RecalculateButton() {
  const [recalculate, { isLoading }] = useRecalculateRankingsMutation();

  const handleClick = async () => {
    try {
      await recalculate().unwrap();
      toast.success('Rankings recalculated');
    } catch {
      toast.error('Recalculation failed');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      loading={isLoading}
      className="h-auto rounded-full border-border bg-card px-5 py-2.5 text-[13px] font-bold text-foreground hover:bg-surface-subtle"
    >
      {!isLoading && (
        <RefreshCw className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
      )}
      Recalculate rankings
    </Button>
  );
}