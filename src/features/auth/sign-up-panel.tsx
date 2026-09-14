import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { env } from '@/config/env';
import useGoogleIdentity from '@/hooks/auth/use-google-identity';
import useSignUp from '@/hooks/auth/use-sign-up';
import { cn } from '@/lib/utils';
import {
  signUpSchema,
  type SignUpFormValues,
} from '@/models/auth/auth-schema';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface SignUpPanelProps {
  brandName?: string;
  eyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  footer?: string;
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
  'rounded-xl border-border bg-card px-3.5 py-2.5 text-base shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm';

export default function SignUpPanel({
  brandName = 'Viva IdeaPad',
  eyebrow = 'CONTRIBUTOR ACCESS',
  heroTitle = 'Turn your ideas into rewarded impact.',
  heroDescription = 'Join writers, creators, and thinkers sharing original perspectives and earning rewards for every accepted concept.',
  footer = 'Viva IdeaPad community platform',
}: SignUpPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  const {
    signUpEmail,
    signUpWithGoogle,
    isSigningUp,
    isGoogleSigningUp,
    resetSubmitError,
  } = useSignUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      consent: false,
    },
  });

  const handleGoogleSuccess = async (credential: string) => {
    resetSubmitError();
    try {
      const res = await signUpWithGoogle(credential);
      const email = res.email || 'your Google account email';
      setSubmittedEmail(email);
      toast.success(
        `Account created. We sent a verification link to ${email}.`,
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(err) ?? 'Google sign-up failed. Please try again.',
      );
    }
  };

  const {
    ready: isGsiReady,
    renderButton: renderGoogleButton,
    prompt: promptGoogle,
  } = useGoogleIdentity({
    onSuccess: handleGoogleSuccess,
  });

  useEffect(() => {
    if (isGsiReady && googleButtonContainerRef.current) {
      renderGoogleButton(googleButtonContainerRef.current);
    }
  }, [isGsiReady, renderGoogleButton]);

  const onSubmit = async (values: SignUpFormValues) => {
    resetSubmitError();
    try {
      await signUpEmail(values);
      const email = values.email.trim().toLowerCase();
      setSubmittedEmail(email);
      toast.success(
        `Account created. We sent a verification link to ${email}.`,
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(err) ?? 'Sign-up failed. Please try again.',
      );
    }
  };

  return (
    <main
      className="relative flex min-h-svh w-full flex-col justify-between overflow-y-auto bg-background font-sans md:h-full md:min-h-0 md:w-1/2 md:justify-center md:bg-surface-subtle md:p-8 lg:p-10"
      data-purpose="auth-form-container"
    >
      <header className="flex w-full shrink-0 items-center justify-between px-5 pt-5 pb-2 md:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
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

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-start px-4 pb-6 sm:px-6 md:flex-initial md:justify-center md:px-0 md:pb-0">
        <section className="relative mt-2 mb-4 overflow-hidden rounded-3xl border border-border bg-secondary p-5 text-foreground shadow-xs sm:p-6 md:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-10 size-44 rounded-full bg-primary/20 blur-2xl"
          />
          <div className="relative z-10 flex flex-col">
            <div className="mb-3 inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 animate-pulse rounded-full bg-primary"
              />
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {eyebrow}
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-extrabold leading-[1.2] tracking-tight text-foreground">
              {heroTitle}
            </h1>
            <p className="text-sm leading-relaxed font-normal text-muted-foreground">
              {heroDescription}
            </p>
          </div>
        </section>

        <div className="mb-4 hidden md:block">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          {submittedEmail ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Check your inbox
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Open the verification link sent to{' '}
                    <span className="font-semibold text-foreground">
                      {submittedEmail}
                    </span>{' '}
                    to submit your idea for review.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  to={CREATOR_ROUTES.login}
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  Go to sign in
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedEmail(null);
                    reset();
                  }}
                  className="w-full cursor-pointer rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  Sign up with a different email
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="mb-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                  START CONTRIBUTING
                </p>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl md:font-bold">
                  Create contributor account
                </h2>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  Sign up with Google or email to start submitting ideas.
                </p>
              </div>

              <div className="mb-3">
                <div className="relative flex w-full justify-center">
                  <div
                    ref={googleButtonContainerRef}
                    className={cn(
                      'flex min-h-[40px] w-full justify-center',
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
                      disabled={isGoogleSigningUp || isSigningUp}
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted/40 disabled:opacity-60"
                    >
                      <GoogleGLogo className="size-5 shrink-0" />
                      <span>Sign up with Google</span>
                    </button>
                  )}

                  {isGoogleSigningUp && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-[1px]">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="ml-2 text-sm font-medium text-foreground">
                        Connecting to Google...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative my-3 flex items-center">
                <div className="flex-grow border-t border-border" />
                <span className="px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  or continue with email
                </span>
                <div className="flex-grow border-t border-border" />
              </div>

              <form
                className="space-y-3"
                data-purpose="registration-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Input
                  id="fullName"
                  label="Full name"
                  placeholder="e.g. Maya Rahman"
                  showRequiredIndicator={false}
                  labelClassName="mb-1 text-xs font-semibold tracking-wide text-foreground"
                  className={fieldClassName}
                  errorClassName="mt-1 text-xs font-semibold text-destructive"
                  errorMessage={errors.fullName?.message}
                  {...register('fullName')}
                />

                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="name@domain.com"
                  showRequiredIndicator={false}
                  labelClassName="mb-1 text-xs font-semibold tracking-wide text-foreground"
                  className={fieldClassName}
                  errorClassName="mt-1 text-xs font-semibold text-destructive"
                  errorMessage={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  showRequiredIndicator={false}
                  labelClassName="mb-1 text-xs font-semibold tracking-wide text-foreground"
                  className={`${fieldClassName} pr-11`}
                  errorClassName="mt-1 text-xs font-semibold text-destructive"
                  errorMessage={errors.password?.message}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="flex cursor-pointer items-center justify-center pr-1 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="size-4 stroke-[1.8]" />
                      )}
                    </button>
                  }
                  {...register('password')}
                />

                <div>
                  <label className="flex cursor-pointer items-start gap-2 select-none">
                    <input
                      type="checkbox"
                      id="consent"
                      className="mt-0.5 size-4 rounded border-border text-primary accent-primary focus:ring-primary/20 focus:ring-offset-0"
                      {...register('consent')}
                    />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      I agree to the Terms and Privacy Policy, and confirm my
                      submissions will be original.
                    </span>
                  </label>
                  {errors.consent?.message && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.consent.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSigningUp || isGoogleSigningUp}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to={CREATOR_ROUTES.login}
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full shrink-0 px-4 py-3 text-center md:py-2">
        <p className="text-xs leading-normal text-muted-foreground">
          Access unlocks after admin review of your first idea.
        </p>
        {footer ? (
          <p className="mt-1 text-xs text-muted-foreground md:hidden">
            {footer}
          </p>
        ) : null}
      </footer>
    </main>
  );
}
