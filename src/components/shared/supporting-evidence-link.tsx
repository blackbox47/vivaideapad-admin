import { Download, File as FileIcon, FileImage, FileText } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SubmissionAttachment } from '@/utils/helpers/parse-submission-attachment';

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function FileGlyph({
  name,
  mimeType,
}: {
  name: string;
  mimeType?: string;
}) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || mimeType?.includes('pdf')) {
    return <FileText className="size-5 text-destructive" aria-hidden />;
  }
  if (
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'png' ||
    ext === 'webp' ||
    mimeType?.startsWith('image/')
  ) {
    return <FileImage className="size-5 text-brand-forest" aria-hidden />;
  }
  return <FileIcon className="size-5 text-brand-sage" aria-hidden />;
}

interface SupportingEvidenceLinkProps {
  attachment: SubmissionAttachment;
  className?: string;
  label?: string;
}

/**
 * Read-only supporting-evidence row used in review/view modals.
 */
export default function SupportingEvidenceLink({
  attachment,
  className,
  label = 'Supporting evidence',
}: SupportingEvidenceLinkProps) {
  return (
    <div className={cn('mt-3.5', className)}>
      <strong className="mb-1.5 block text-[12px] font-extrabold tracking-[0.08em] text-brand-sage uppercase">
        {label}
      </strong>
      <a
        href={attachment.href}
        target="_blank"
        rel="noopener noreferrer"
        download={attachment.originalName}
        className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-subtle p-3 text-foreground transition-colors hover:border-brand-forest/50 hover:bg-card"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
          <FileGlyph
            name={attachment.originalName}
            mimeType={attachment.mimeType}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{attachment.originalName}</p>
          <p className="text-xs text-muted-foreground">
            {attachment.size != null
              ? `${formatBytes(attachment.size)} · `
              : null}
            Open / download
          </p>
        </div>
        <Download className="size-4 shrink-0 text-brand-forest" aria-hidden />
      </a>
    </div>
  );
}
