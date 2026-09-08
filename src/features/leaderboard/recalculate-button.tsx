import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useRecalculateRankingsMutation } from '@/services/leaderboard/leaderboard-service';

export default function RecalculateButton() {
  const [recalculate, { isLoading }] = useRecalculateRankingsMutation();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      await recalculate().unwrap();
      setFeedback('Rankings recalculated');
      window.setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback('Recalculation failed');
      window.setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
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
      {feedback ? (
        <span className="text-[11px] font-semibold text-success">
          {feedback}
        </span>
      ) : null}
    </div>
  );
}