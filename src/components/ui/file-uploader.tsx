import * as React from 'react';
import {
  AlertCircle,
  File as FileIcon,
  FileImage,
  FileText,
  X,
} from 'lucide-react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FileUploaderProps {
  id?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  required?: boolean;
  accept?: string;
  acceptText?: string;
  maxSizeBytes?: number;
  value?: File | string | null;
  fileName?: string;
  fileSize?: number;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  errorMessage?: string | null;
  error?: string | null;
  className?: string;
  containerClassName?: string;
}

const DEFAULT_ACCEPT =
  '.pdf,.docx,.doc,.jpg,.jpeg,.png,image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const DEFAULT_ACCEPT_TEXT = 'PDF, DOCX, JPG or PNG · up to 10 MB';
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
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
  value,
  fileName: fileNameProp,
  fileSize: fileSizeProp,
  onChange,
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

  // Selected file tracking (supports both controlled and uncontrolled usage)
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const selectedFile =
    value instanceof File ? value : value === null ? null : internalFile;

  const activeError = errorMessage ?? error ?? localError;
  const errorId = activeError ? `${inputId}-error` : undefined;

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File size (${formatBytes(file.size)}) exceeds the maximum allowed size of ${formatBytes(maxSizeBytes)}.`;
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
        return 'Unsupported file format. Please upload an accepted file type.';
      }
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    setInternalFile(file);
    onChange?.(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input value so re-selecting same file triggers change
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
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
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    setInternalFile(null);
    setLocalError(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerBrowse = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerBrowse();
    }
  };

  // Determine display info for currently selected file
  const currentFileName =
    selectedFile?.name ||
    fileNameProp ||
    (typeof value === 'string' && value
      ? value.split('/').pop()?.split('?')[0]
      : null);
  const currentFileSize = selectedFile?.size || fileSizeProp;

  const hasFile = Boolean(selectedFile || (typeof value === 'string' && value));

  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <Label
          htmlFor={inputId}
          className={cn(
            'mb-1.5 block text-[12px] font-bold text-foreground',
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
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={triggerBrowse}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-describedby={errorId}
        aria-invalid={Boolean(activeError)}
        className={cn(
          'group relative flex min-h-[84px] w-full cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed px-4 py-4 text-center transition-all duration-200 outline-none',
          'border-border bg-card hover:border-brand-sage-light hover:bg-surface-subtle/60',
          'focus-visible:border-brand-sage-light focus-visible:ring-2 focus-visible:ring-success-muted',
          isDragOver &&
            'border-primary bg-secondary/30 ring-2 ring-primary/20 scale-[0.995]',
          disabled &&
            'cursor-not-allowed opacity-60 bg-muted hover:border-border hover:bg-muted',
          activeError && 'border-destructive/60 bg-destructive-subtle/10',
          className,
        )}
      >
        {hasFile ? (
          <div className="flex w-full items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3 min-w-0 text-left">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border">
                {getFileIcon(currentFileName || '', selectedFile?.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {currentFileName}
                </p>
                <p className="text-xs text-text-subtle">
                  {currentFileSize
                    ? formatBytes(currentFileSize)
                    : 'File selected'}{' '}
                  ·{' '}
                  <span className="text-brand-forest hover:underline">
                    Click to replace
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              title="Remove file"
              aria-label="Remove file"
              className="shrink-0 rounded-full p-1.5 text-text-subtle transition-colors hover:bg-destructive-subtle hover:text-destructive cursor-pointer disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium text-foreground">
              Drop files here or{' '}
              <span className="font-semibold text-primary underline underline-offset-2 group-hover:text-brand-forest">
                browse
              </span>
            </p>
            {acceptText ? (
              <p className="text-xs text-text-subtle">{acceptText}</p>
            ) : null}
          </div>
        )}
      </div>

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
