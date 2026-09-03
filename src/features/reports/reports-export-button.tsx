import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

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

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isExporting}
        loading={isExporting}
        className="h-auto rounded-full bg-primary px-[18px] py-[11px] font-bold text-primary-foreground hover:bg-brand-forest"
      >
        {!isExporting && (
          <Download className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
        )}
        Export report (.csv)
      </Button>
      {feedback ? (
        <span
          className={`text-[11px] font-semibold ${
            feedback.startsWith('Export failed')
              ? 'text-destructive'
              : 'text-success'
          }`}
        >
          {feedback}
        </span>
      ) : null}
    </div>
  );
}