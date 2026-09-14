import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { toast } from '@/components/ui/sonner';
import { env } from '@/config/env';
import { cn } from '@/lib/utils';

function GoogleGLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface GoogleContinueButtonProps {
  label: string;
  isGsiReady: boolean;
  isBusy?: boolean;
  disabled?: boolean;
  /** Host for `google.accounts.id.renderButton`. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Used only while GIS is still initializing. */
  onFallbackClick: () => void;
  className?: string;
  heightClassName?: string;
  busyLabel?: ReactNode;
}

/**
 * Themed Google CTA. Google’s button is an iframe we cannot restyle, and
 * `prompt()` (One Tap) is unreliable as a click stand-in — so we keep GIS
 * mounted on top (nearly invisible) for the real click, and paint brand
 * chrome underneath. Hover is latched while the pointer is over the control
 * (including over the iframe, which otherwise swallows mouse events).
 */
export default function GoogleContinueButton({
  label,
  isGsiReady,
  isBusy = false,
  disabled = false,
  containerRef,
  onFallbackClick,
  className,
  heightClassName = 'h-11',
  busyLabel = 'Connecting to Google...',
}: GoogleContinueButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const gsiReady = isGsiReady && Boolean(env.googleClientId);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;

    const onEnter = () => setHovered(true);

    const onLeave = (event: MouseEvent) => {
      const related = event.relatedTarget;
      // Moving into the cross-origin GIS iframe usually yields relatedTarget=null.
      // Keep the hover ring on; a window pointermove outside will clear it.
      if (related === null) {
        setHovered(true);
        return;
      }
      if (related instanceof Node && node.contains(related)) {
        setHovered(true);
        return;
      }
      setHovered(false);
    };

    const onWindowMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) setHovered(false);
    };

    node.addEventListener('mouseenter', onEnter);
    node.addEventListener('mouseleave', onLeave);
    window.addEventListener('pointermove', onWindowMove);
    return () => {
      node.removeEventListener('mouseenter', onEnter);
      node.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('pointermove', onWindowMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn('relative w-full', heightClassName, className)}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-3 rounded-full border bg-card px-4 text-sm font-semibold text-foreground shadow-xs transition-all duration-200',
          hovered
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-border',
        )}
      >
        <GoogleGLogo className="size-5 shrink-0" />
        <span>{label}</span>
      </div>

      <div
        ref={containerRef}
        className={cn(
          'absolute inset-0 z-10 overflow-hidden rounded-full opacity-[0.01]',
          !gsiReady && 'pointer-events-none',
        )}
      />

      {!gsiReady && (
        <button
          type="button"
          onClick={() => {
            if (!env.googleClientId) {
              toast.error('Google Sign-In is not configured.');
              return;
            }
            onFallbackClick();
          }}
          disabled={disabled || isBusy}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            'absolute inset-0 z-20 flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-card px-4 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60',
            hovered ? 'border-primary bg-primary/5 shadow-md' : 'border-border',
          )}
        >
          <GoogleGLogo className="size-5 shrink-0" />
          <span>{label}</span>
        </button>
      )}

      {isBusy && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-[1px]">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span className="ml-2 text-xs font-medium text-foreground">
            {busyLabel}
          </span>
        </div>
      )}
    </div>
  );
}
