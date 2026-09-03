import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScreenLoaderProps {
  /**
   * If true, covers the entire viewport with a backdrop.
   * If false, renders as a centered container component.
   */
  fullScreen?: boolean;
  /**
   * Primary loading label displayed under the spinner.
   * Default: 'Loading...'
   */
  label?: string;
  /**
   * Secondary supporting text.
   */
  description?: string;
  /**
   * Size preset for the loader.
   * Default: 'default'
   */
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function ScreenLoader({
  fullScreen = false,
  label = 'Loading…',
  description,
  size = 'default',
  className,
}: ScreenLoaderProps) {
  const spinnerSizeClass =
    size === 'sm' ? 'size-6' : size === 'lg' ? 'size-12' : 'size-9';

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex flex-col items-center justify-center text-center select-none',
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle glowing ambient pulse */}
        <div className="absolute -inset-2 rounded-full bg-brand-lime/20 blur-md animate-pulse" />
        
        {/* Brand spinner */}
        <Loader2
          className={cn(
            'animate-spin text-primary transition-colors',
            spinnerSizeClass,
          )}
          strokeWidth={2.25}
        />

        {/* Center brand diamond mark */}
        <span
          className="absolute text-[10px] font-bold text-brand-forest select-none"
          aria-hidden="true"
        >
          ◇
        </span>
      </div>

      {label ? (
        <p className="mt-3.5 text-sm font-semibold tracking-tight text-foreground">
          {label}
        </p>
      ) : null}

      {description ? (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          {description}
        </p>
      ) : null}
      <span className="sr-only">{label || 'Loading content'}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex min-h-svh w-screen items-center justify-center bg-background/85 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[260px] w-full flex-1 items-center justify-center py-10">
      {content}
    </div>
  );
}

export { ScreenLoader };
