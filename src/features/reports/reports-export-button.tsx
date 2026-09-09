import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface ReportsExportButtonProps {
  onExport: () => Promise<string | null>;
  isExporting: boolean;
}

export default function ReportsExportButton({
  onExport,
  isExporting,
}: ReportsExportButtonProps) {
  const handleClick = async () => {
    const filename = await onExport();
    if (filename) {
      toast.success(`Exported as ${filename}`);
    } else {
      toast.error('Export failed — please try again');
    }
  };

  return (
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
  );
}