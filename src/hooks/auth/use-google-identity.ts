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

export default function useGoogleIdentity({
  onSuccess,
  onError,
  clientId = env.googleClientId,
}: UseGoogleIdentityOptions): UseGoogleIdentityResult {
  const [ready, setReady] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

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
      if (!ready || typeof window === 'undefined' || !window.google?.accounts?.id) {
        return;
      }

      // Avoid re-mounting if button iframe is already rendered
      if (el.children.length > 0) {
        return;
      }

      // Calculate width to match container (GIS width is clamped between 200 and 400)
      const containerWidth = el.offsetWidth || 384;
      const targetWidth = Math.min(Math.max(containerWidth, 200), 400);

      window.google.accounts.id.renderButton(el, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: targetWidth,
        logo_alignment: 'left',
      });
    },
    [ready],
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
