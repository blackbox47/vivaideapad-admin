import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import useAuth from '@/hooks/auth/use-auth';
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
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

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
                disabled={isLoggingIn}
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
