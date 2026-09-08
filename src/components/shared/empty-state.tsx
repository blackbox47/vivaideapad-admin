import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Main heading text, defaults to 'No data available' */
  title?: React.ReactNode;
  /** Explanatory description below the title */
  description?: React.ReactNode;
  /** Optional action element, such as a Button */
  action?: React.ReactNode;
  /** Whether to wrap the component in a bordered card shell (default: true) */
  card?: boolean;
  /** Size scale for the illustration and padding */
  size?: 'sm' | 'md' | 'lg';
  /** Additional wrapper class names */
  className?: string;
  /** Accessibility role/label */
  ariaLabel?: string;
}

export function EmptyIllustration({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const svgClass = isSm
    ? 'w-14 h-14'
    : isLg
      ? 'w-24 h-24'
      : 'w-20 h-20';

  const bubbleClass = isSm
    ? 'absolute -top-1 -right-1 bg-slate-600 dark:bg-slate-700 text-white rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm'
    : 'absolute -top-1 -right-2 bg-slate-600 dark:bg-slate-700 text-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm';

  const dotClass = isSm
    ? 'w-1 h-1 rounded-full bg-white opacity-80 inline-block'
    : 'w-1.5 h-1.5 rounded-full bg-white opacity-80 inline-block';

  const rectDotClass = isSm
    ? 'w-1 h-1 rounded-[0.5px] bg-white opacity-80 inline-block'
    : 'w-1.5 h-1.5 rounded-[1px] bg-white opacity-80 inline-block';

  const triClass = isSm
    ? 'w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[3.5px] border-b-white opacity-80 inline-block'
    : 'w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-white opacity-80 inline-block';

  return (
    <div
      className={cn('relative', isSm ? 'mb-3' : 'mb-5')}
      data-purpose="empty-state-illustration"
      aria-hidden="true"
    >
      <svg
        className={cn(svgClass, 'text-gray-300')}
        fill="none"
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow / Base ellipse */}
        <ellipse
          cx="40"
          cy="70"
          rx="28"
          ry="5"
          className="fill-[#f1f5f9] dark:fill-white/5"
        />

        {/* Document standing inside tray */}
        <rect
          x="25"
          y="16"
          width="30"
          height="38"
          rx="4"
          strokeWidth="1.5"
          className="fill-[#e2e8f0] stroke-[#cbd5e1] dark:fill-[#1b382e] dark:stroke-[#2e5547]"
        />
        <rect
          x="29"
          y="22"
          width="22"
          height="15"
          rx="2"
          className="fill-[#cbd5e1] dark:fill-[#244b3e]"
        />
        <line
          x1="29"
          y1="43"
          x2="51"
          y2="43"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-[#94a3b8] dark:stroke-[#4b7062]"
        />
        <line
          x1="29"
          y1="48"
          x2="43"
          y2="48"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-[#94a3b8] dark:stroke-[#4b7062]"
        />

        {/* Outer Tray Body with cutout notch */}
        <path
          d="M19 46C19 43.7909 20.7909 42 23 42H28.5C30.2 42 31.6 43.1 32.1 44.7L33.4 48.5C34.1 50.6 36.1 52 38.3 52H41.7C43.9 52 45.9 50.6 46.6 48.5L47.9 44.7C48.4 43.1 49.8 42 51.5 42H57C59.2091 42 61 43.7909 61 46V64C61 66.2091 59.2091 68 57 68H23C20.7909 68 19 66.2091 19 64V46Z"
          className="fill-[#475569] dark:fill-[#122e25]"
        />

        {/* Tray bevel highlight */}
        <path
          d="M21 46H28.5L33 55H47L51.5 46H59"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-[#64748b] dark:stroke-[#244b3e]"
        />
      </svg>

      {/* Floating Speech Bubble with geometric indicators */}
      <div className={bubbleClass}>
        <span className={dotClass} />
        <span className={rectDotClass} />
        <span className={triClass} />
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No data available',
  description,
  action,
  card = true,
  size = 'md',
  className,
  ariaLabel,
}: EmptyStateProps) {
  const paddingClass =
    size === 'sm'
      ? 'py-6 px-4'
      : size === 'lg'
        ? 'py-16 px-8 min-h-[380px]'
        : 'py-12 px-6 min-h-[300px]';

  return (
    <div
      role="status"
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Empty state')}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        card && 'rounded-[22px] border border-border bg-card shadow-sm',
        paddingClass,
        className,
      )}
      data-purpose="empty-state-view"
    >
      <EmptyIllustration size={size} />

      {title ? (
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      ) : null}

      {description ? (
        <p className="mt-1 text-[13px] text-muted-foreground max-w-md">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
