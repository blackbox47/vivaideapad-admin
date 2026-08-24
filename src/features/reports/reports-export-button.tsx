import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ReportsExportButtonProps {
  onExport: () => Promise<string | null>;
  isExporting: boolean;
}

export default function ReportsExportButton({
  onExport,
  isExporting,
}: ReportsExportButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClick = async () => {
    setFeedback(null);
    const filename = await onExport();
    if (filename) {
      setFeedback(`Exported as ${filename}`);
    } else {
      setFeedback('Export failed — please try again');
    }
    window.setTimeout(() => setFeedback(null), 3000);
  };

  const Icon = isExporting ? Loader2 : Download;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-full bg-[#12231f] px-[18px] py-[11px] font-bold text-white transition-colors hover:bg-[#254b40] disabled:opacity-60"
      >
        <Icon
          className={`size-4 ${isExporting ? 'animate-spin' : ''}`}
          strokeWidth={2.25}
          aria-hidden
        />
        Export report (.csv)
      </button>
      {feedback ? (
        <span
          className={`text-[11px] font-semibold ${
            feedback.startsWith('Export failed')
              ? 'text-[#b3401f]'
              : 'text-[#16805e]'
          }`}
        >
          {feedback}
        </span>
      ) : null}
    </div>
  );
}