import type React from 'react';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';

const Toaster = ({
  position = 'top-right',
  closeButton = true,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme={props.theme ?? 'light'}
      position={position}
      closeButton={closeButton}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ),
        close: <XIcon className="size-3.5" />,
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--toast-close-button-start': 'unset',
          '--toast-close-button-end': '0.5rem',
          '--toast-close-button-transform': 'none',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pr-8',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
          closeButton:
            '!left-auto !right-2 !top-2 !transform-none group-[.toast]:bg-card group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground group-[.toast]:border-border hover:group-[.toast]:bg-muted transition-colors',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
