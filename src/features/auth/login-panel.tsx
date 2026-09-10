import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { env } from '@/config/env';
import useAuth from '@/hooks/auth/use-auth';
import useGoogleIdentity from '@/hooks/auth/use-google-identity';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/models/auth/auth-model';
import {
  loginSchema,
  type LoginFormValues,
} from '@/models/auth/auth-schema';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

interface LoginPanelProps {
  role: UserRole;
  brandName?: string;
  eyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  footer?: string;
}

function homeForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.dashboard : CREATOR_ROUTES.dashboard;
}

function BrandMark() {
  return (
    <div
      className="flex size-7 items-center justify-center rounded-xl bg-primary shadow-xs"
      aria-hidden
    >
      <div className="size-2.5 rounded-full bg-white" />
    </div>
  );
}

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

const fieldClassName =
  'rounded-xl border-border bg-card px-4 py-3 text-base shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm';


export default function LoginPanel({
  role,
  brandName = 'Viva IdeaPad',
  eyebrow = 'WELCOME BACK',
  heroTitle = 'Ideas grow when you show up.',
  heroDescription = 'Continue creating, reviewing or shaping the next opportunity.',
  footer = 'Viva IdeaPad community platform',
}: LoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const {
    login,
    isLoggingIn,
    googleLogin,
    isGoogleLoggingIn,
    loginError,
    resetLoginError,
  } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credential: string) => {
    resetLoginError();
    try {
      await googleLogin(credential);
      toast.success('Welcome back!');
      navigate({ to: homeForRole(role), replace: true });
    } catch {
      // Error handled via loginError in useAuth
    }
  };

  const { ready: isGsiReady, renderButton: renderGoogleButton, prompt: promptGoogle } =
    useGoogleIdentity({
      onSuccess: handleGoogleSuccess,
    });

  useEffect(() => {
    if (role === 'creator' && isGsiReady && googleButtonContainerRef.current) {
      renderGoogleButton(googleButtonContainerRef.current);
    }
  }, [role, isGsiReady, renderGoogleButton]);

  const forgotPasswordPath = CREATOR_ROUTES.forgotPassword;

  const onSubmit = async (values: LoginFormValues) => {
    resetLoginError();
    try {
      await login(values, { asRole: role });
      toast.success('Welcome back!');
      navigate({ to: homeForRole(role), replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  return (
    <section className="relative flex min-h-svh w-full flex-col justify-between overflow-y-auto bg-background font-sans md:min-h-0 md:w-1/2 md:items-center md:justify-center md:bg-surface-subtle md:p-12 lg:p-14">
      <header className="flex w-full items-center justify-between px-5 pt-5 pb-3 md:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-sm font-bold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col justify-start px-4 pb-8 sm:px-6 md:max-w-sm md:flex-initial md:p-0">
        <section className="relative mt-2 mb-6 overflow-hidden rounded-3xl border border-border bg-secondary p-6 text-foreground shadow-xs sm:p-7 md:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-10 size-44 rounded-full bg-primary/20 blur-2xl"
          />
          <div className="relative z-10 flex flex-col">
            <div className="mb-4 inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 animate-pulse rounded-full bg-primary"
              />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
                {eyebrow}
              </span>
            </div>
            <h1 className="mb-3 text-2xl font-extrabold leading-[1.2] tracking-tight text-foreground sm:text-3xl">
              {heroTitle}
            </h1>
            <p className="text-sm leading-relaxed font-normal text-muted-foreground">
              {heroDescription}
            </p>
          </div>
        </section>

        <div className="mb-8 hidden md:block">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl md:font-bold">
              Sign in
            </h2>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form
            className="space-y-4 md:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <Input
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter email address"
                showRequiredIndicator={false}
                labelClassName="mb-1.5 text-xs font-semibold tracking-wide text-foreground"
                className={fieldClassName}
                errorMessage={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                showRequiredIndicator={false}
                labelClassName="mb-1.5 text-xs font-semibold tracking-wide text-foreground"
                className={`${fieldClassName} pr-11`}
                errorMessage={errors.password?.message}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex cursor-pointer items-center justify-center pr-1 text-muted-foreground transition-colors hover:text-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 stroke-[1.8]" />
                    ) : (
                      <Eye className="size-5 stroke-[1.8]" />
                    )}
                  </button>
                }
                {...register('password')}
              />
            </div>

            {loginError ? (
              <div
                className="rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive"
                role="alert"
              >
                {loginError}
              </div>
            ) : null}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn || isGoogleLoggingIn}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"

              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {role === 'creator' && (
              <div className="pt-1">
                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                    or
                  </span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <div className="relative flex w-full justify-center">
                  <div
                    ref={googleButtonContainerRef}
                    className={cn(
                      'flex w-full justify-center min-h-[44px]',
                      (!isGsiReady || !env.googleClientId) && 'hidden',
                    )}
                  />
                  {(!isGsiReady || !env.googleClientId) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isGsiReady) {
                          promptGoogle();
                        } else {
                          toast.info('Google Sign-In is initializing...');
                        }
                      }}
                      disabled={isGoogleLoggingIn || isLoggingIn}
                      className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
                    >
                      <GoogleGLogo className="size-5 shrink-0" />
                      <span>Continue with Google</span>
                    </button>
                  )}

                  {isGoogleLoggingIn && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-[1px] pointer-events-none">
                      <Loader2 className="size-4 animate-spin text-brand-pine-deep" />
                      <span className="ml-2 text-xs font-medium text-gray-700">
                        Connecting to Google...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                to={forgotPasswordPath}
                className="cursor-pointer text-xs font-medium text-muted-foreground no-underline transition-colors hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full px-4 py-4 text-center md:hidden">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
          {footer}
        </p>
      </footer>
    </section>
  );
}
