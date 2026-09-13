import { useCallback, useEffect, useRef, useState } from 'react';
import { env } from '@/config/env';

let scriptLoading = false;
let scriptLoaded = false;
let initializedClientId: string | null = null;
let activeCallback:
  | ((response: google.accounts.id.CredentialResponse) => void)
  | null = null;

interface UseGoogleIdentityOptions {
  onSuccess: (credential: string) => void | Promise<void>;
  onError?: (error: unknown) => void;
  clientId?: string;
}

interface UseGoogleIdentityResult {
  ready: boolean;
  renderButton: (el: HTMLElement) => void;
  prompt: () => void;
}

/**
 * GIS renders an iframe at a fixed pixel width, so the width has to be
 * recomputed whenever the available space changes — otherwise a button sized
 * for a wide layout keeps that width and overflows its card on a 320px screen.
 * The host element is a shrink-to-fit flex item, so measure its parent, whose
 * width is driven by the layout rather than by the button itself.
 */
function measureAvailableWidth(el: HTMLElement): number {
  const available = el.parentElement?.clientWidth || el.offsetWidth || 384;
  // GIS clamps the rendered button between 200px and 400px.
  return Math.min(Math.max(available, 200), 400);
}

export default function useGoogleIdentity({
  onSuccess,
  onError,
  clientId = env.googleClientId,
}: UseGoogleIdentityOptions): UseGoogleIdentityResult {
  const [ready, setReady] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const containerRef = useRef<HTMLElement | null>(null);
  const renderedWidthRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    activeCallback = (response) => {
      if (response.credential) {
        try {
          void onSuccessRef.current(response.credential);
        } catch (err) {
          onErrorRef.current?.(err);
        }
      }
    };
  });

  useEffect(() => {
    if (!clientId) {
      return undefined;
    }

    const initGsi = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id) {
        return;
      }

      if (initializedClientId !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            activeCallback?.(response);
          },
        });
        initializedClientId = clientId;
      }

      setReady(true);
    };

    if (window.google?.accounts?.id) {
      scriptLoaded = true;
      initGsi();
      return undefined;
    }

    let intervalId: number | undefined;

    if (!scriptLoading && !scriptLoaded) {
      scriptLoading = true;
      const script = document.createElement('script');
      script.id = 'google-identity-services';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded = true;
        scriptLoading = false;
        initGsi();
      };
      script.onerror = (err) => {
        scriptLoading = false;
        onErrorRef.current?.(err);
      };
      document.body.appendChild(script);
    } else {
      // Script is already loading, poll for google global
      intervalId = window.setInterval(() => {
        if (window.google?.accounts?.id) {
          window.clearInterval(intervalId);
          initGsi();
        }
      }, 50);
    }

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [clientId]);

  const renderButton = useCallback(
    (el: HTMLElement) => {
      const paint = (target: HTMLElement) => {
        if (
          !ready ||
          typeof window === 'undefined' ||
          !window.google?.accounts?.id
        ) {
          return;
        }

        containerRef.current = target;
        const targetWidth = measureAvailableWidth(target);

        // Already mounted at the right width — leave the existing iframe alone.
        if (target.children.length > 0 && renderedWidthRef.current === targetWidth) {
          return;
        }

        target.replaceChildren();
        renderedWidthRef.current = targetWidth;

        window.google.accounts.id.renderButton(target, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: targetWidth,
          logo_alignment: 'left',
        });

        // Re-render on layout changes so the fixed-width iframe keeps matching
        // the card. The observed parent is sized by the layout, not by the
        // button, so re-rendering can't feed back into another resize.
        const observed = target.parentElement;
        if (
          !resizeObserverRef.current &&
          observed &&
          typeof ResizeObserver !== 'undefined'
        ) {
          resizeObserverRef.current = new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
              const current = containerRef.current;
              if (current?.isConnected) {
                paint(current);
              }
            });
          });
          resizeObserverRef.current.observe(observed);
        }
      };

      paint(el);
    },
    [ready],
  );

  useEffect(
    () => () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    },
    [],
  );

  const prompt = useCallback(() => {
    if (ready && typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  }, [ready]);

  return {
    ready,
    renderButton,
    prompt,
  };
}
