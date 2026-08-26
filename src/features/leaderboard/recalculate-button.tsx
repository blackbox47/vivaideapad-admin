import { Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

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

  const Icon = isLoading ? Loader2 : RefreshCw;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:bg-surface-subtle disabled:opacity-60 cursor-pointer"
      >
        <Icon
          className={`size-4 ${isLoading ? 'animate-spin' : ''}`}
          strokeWidth={2.25}
          aria-hidden
        />
        Recalculate rankings
      </button>
      {feedback ? (
        <span className="text-[11px] font-semibold text-success">
          {feedback}
        </span>
      ) : null}
    </div>
  );
}