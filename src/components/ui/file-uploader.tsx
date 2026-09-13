import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  File as FileIcon,
  FileImage,
  FileText,
  UploadCloud,
  X,
} from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface ExistingAttachmentItem {
  id?: string;
  name: string;
  url?: string;
  size?: number | string;
  mime_type?: string;
  type?: string;
  original_name?: string;
}

export interface FileUploaderProps {
  id?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  required?: boolean;
  accept?: string;
  acceptText?: string;
  maxSizeBytes?: number;
  maxFiles?: number;
  multiple?: boolean;
  // Single-file mode
  value?: File | string | null;
  fileName?: string;
  fileSize?: number;
  onChange?: (file: File | null) => void;
  // Multiple-files mode
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  existingFiles?: ExistingAttachmentItem[];
  onRemoveExisting?: (index: number) => void;
  disabled?: boolean;
  errorMessage?: string | null;
  error?: string | null;
  className?: string;
  containerClassName?: string;
}

const DEFAULT_ACCEPT =
  '.pdf,.docx,.doc,.jpg,.jpeg,.png,image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const DEFAULT_ACCEPT_TEXT = 'PDF, DOCX, JPG or PNG · up to 10 MB per document · max 5 documents';
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const DEFAULT_MAX_FILES = 5;

function formatBytes(bytes: number | string | undefined): string {
  if (bytes === undefined || bytes === null || bytes === '') return '';
  const num = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (isNaN(num) || num <= 0) {
    if (typeof bytes === 'string' && bytes.includes('B')) return bytes;
    return '';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(1024));
  return `${(num / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getFileIcon(fileName: string, mimeType?: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf' || mimeType?.includes('pdf')) {
    return <FileText className="size-5 text-destructive" />;
  }
  if (
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'png' ||
    ext === 'webp' ||
    mimeType?.startsWith('image/')
  ) {
    return <FileImage className="size-5 text-brand-forest" />;
  }
  return <FileIcon className="size-5 text-brand-sage" />;
}

export function FileUploader({
  id,
  label,
  labelClassName,
  required,
  accept = DEFAULT_ACCEPT,
  acceptText = DEFAULT_ACCEPT_TEXT,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  multiple = false,
  value,
  fileName: fileNameProp,
  fileSize: fileSizeProp,
  onChange,
  files = [],
  onFilesChange,
  existingFiles = [],
  onRemoveExisting,
  disabled = false,
  errorMessage,
  error,
  className,
  containerClassName,
}: FileUploaderProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Single-file fallback state
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const selectedFile =
    value instanceof File ? value : value === null ? null : internalFile;

  const activeError = errorMessage ?? error ?? localError;
  const errorId = activeError ? `${inputId}-error` : undefined;

  const totalFilesCount = multiple
    ? existingFiles.length + files.length
    : selectedFile || value
      ? 1
      : 0;

  const isMaxReached = multiple && totalFilesCount >= maxFiles;

  const validateSingleFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" (${formatBytes(file.size)}) exceeds the maximum allowed size of ${formatBytes(maxSizeBytes)}.`;
    }

    if (accept && accept !== '*') {
      const acceptedPatterns = accept
        .split(',')
        .map((p) => p.trim().toLowerCase());
      const fileNameLower = file.name.toLowerCase();
      const fileMime = file.type.toLowerCase();

      const isMatch = acceptedPatterns.some((pattern) => {
        if (pattern.startsWith('.')) {
          return fileNameLower.endsWith(pattern);
        }
        if (pattern.endsWith('/*')) {
          const typeGroup = pattern.replace('/*', '');
          return fileMime.startsWith(`${typeGroup}/`);
        }
        return fileMime === pattern;
      });

      if (!isMatch) {
        return `Unsupported file format for "${file.name}". Please upload an accepted file type.`;
      }
    }

    return null;
  };

  const handleIncomingFiles = (incomingList: FileList | File[]) => {
    const list = Array.from(incomingList);
    if (list.length === 0) return;

    if (!multiple) {
      const file = list[0];
      const validationError = validateSingleFile(file);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError(null);
      setInternalFile(file);
      onChange?.(file);
      return;
    }

    // Multiple mode
    const availableSlots = maxFiles - totalFilesCount;
    if (availableSlots <= 0) {
      setLocalError(`You have already attached the maximum of ${maxFiles} documents.`);
      return;
    }

    const filesToConsider = list.slice(0, availableSlots);
    if (list.length > availableSlots) {
      setLocalError(
        `Only ${availableSlots} more document${availableSlots > 1 ? 's' : ''} could be added. Maximum ${maxFiles} documents allowed.`,
      );
    } else {
      setLocalError(null);
    }

    const validNewFiles: File[] = [];
    for (const file of filesToConsider) {
      const valError = validateSingleFile(file);
      if (valError) {
        setLocalError(valError);
        return;
      }
      validNewFiles.push(file);
    }

    if (validNewFiles.length > 0) {
      onFilesChange?.([...files, ...validNewFiles]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleIncomingFiles(event.target.files);
    }
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || isMaxReached) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (disabled || isMaxReached) return;

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleIncomingFiles(event.dataTransfer.files);
    }
  };

  const triggerBrowse = () => {
    if (disabled || isMaxReached) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || isMaxReached) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerBrowse();
    }
  };

  const handleRemoveSingle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setInternalFile(null);
    setLocalError(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveUploadedFile = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLocalError(null);
    const updated = files.filter((_, i) => i !== index);
    onFilesChange?.(updated);
  };

  const handleRemoveExistingFile = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setLocalError(null);
    onRemoveExisting?.(index);
  };

  // Single-file display calculation
  const currentFileName =
    selectedFile?.name ||
    fileNameProp ||
    (typeof value === 'string' && value
      ? value.split('/').pop()?.split('?')[0]
      : null);
  const currentFileSize = selectedFile?.size || fileSizeProp;
  const hasSingleFile = Boolean(selectedFile || (typeof value === 'string' && value));

  return (
    <div className={cn('w-full space-y-3', containerClassName)}>
      <div className="flex items-center justify-between">
        {label ? (
          <Label
            htmlFor={inputId}
            className={cn(
              'block text-[12px] font-bold text-foreground',
              labelClassName,
            )}
          >
            {label}
            {required ? (
              <span className="ml-0.5 text-destructive" aria-hidden="true">
                *
              </span>
            ) : null}
          </Label>
        ) : <span />}

        {multiple && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full border',
              isMaxReached
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-muted text-muted-foreground border-border',
            )}
          >
            {totalFilesCount}/{maxFiles} documents
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled || isMaxReached}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Dropzone area */}
      {(!multiple || !isMaxReached) && (
        <div
          role="button"
          tabIndex={disabled || isMaxReached ? -1 : 0}
          onClick={triggerBrowse}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-describedby={errorId}
          aria-invalid={Boolean(activeError)}
          className={cn(
            'group relative flex min-h-[130px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-all outline-none',
            'border-border bg-[#fdfefd] dark:bg-card/40 hover:border-brand-forest/70 hover:bg-[#f7faf9] dark:hover:bg-card',
            'focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-forest/15',
            isDragOver &&
              'border-primary bg-secondary/30 ring-2 ring-primary/20 scale-[0.995]',
            disabled &&
              'cursor-not-allowed opacity-60 bg-muted hover:border-border hover:bg-muted',
            activeError && 'border-destructive/60 bg-destructive-subtle/10',
            className,
          )}
        >
          {!multiple && hasSingleFile ? (
            <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0 text-left">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border">
                  {getFileIcon(currentFileName || '', selectedFile?.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {currentFileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentFileSize
                      ? formatBytes(currentFileSize)
                      : 'File selected'}{' '}
                    ·{' '}
                    <span className="text-brand-forest font-semibold hover:underline">
                      Click to replace
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveSingle}
                disabled={disabled}
                title="Remove file"
                aria-label="Remove file"
                className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive cursor-pointer disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="flex size-10 items-center justify-center rounded-full bg-surface-subtle border border-border text-brand-forest">
                <UploadCloud className="size-5" />
              </div>
              <p className="text-sm sm:text-base text-foreground font-medium">
                Drop documents here or{' '}
                <span className="font-semibold text-brand-forest underline decoration-brand-forest/40 underline-offset-2">
                  browse
                </span>
              </p>
              {acceptText ? (
                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                  {acceptText}
                </p>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Multiple mode: Document list */}
      {multiple && totalFilesCount > 0 && (
        <div className="space-y-2 pt-1" data-purpose="attached-documents-list">
          {/* Existing files from server */}
          {existingFiles.map((doc, idx) => (
            <div
              key={doc.id || doc.url || `existing-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs transition-colors hover:border-brand-forest/40"
            >
              <div className="flex items-center gap-3 min-w-0 text-left">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border">
                  {getFileIcon(doc.name || 'document', doc.mime_type || doc.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {doc.name || 'Supporting Document'}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" /> Saved
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {doc.size ? <span>{formatBytes(doc.size)}</span> : null}
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand-forest hover:underline font-medium"
                      >
                        View <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleRemoveExistingFile(idx, e)}
                disabled={disabled}
                title={`Remove ${doc.name || 'document'}`}
                aria-label={`Remove ${doc.name || 'document'}`}
                className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive cursor-pointer disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          {/* Newly selected local files */}
          {files.map((file, idx) => (
            <div
              key={`new-${file.name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-emerald-600/30 bg-card p-3 shadow-2xs transition-colors hover:border-emerald-600"
            >
              <div className="flex items-center gap-3 min-w-0 text-left">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border">
                  {getFileIcon(file.name, file.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {file.name}
                    </p>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleRemoveUploadedFile(idx, e)}
                disabled={disabled}
                title={`Remove ${file.name}`}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive cursor-pointer disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* When max files is reached in multiple mode */}
      {isMaxReached && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <span>Maximum limit of {maxFiles} documents reached.</span>
          <span>Remove a document above to attach a different one.</span>
        </div>
      )}

      {activeError ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{activeError}</span>
        </p>
      ) : null}
    </div>
  );
}

export default FileUploader;
