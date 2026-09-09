import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
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

function loginForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.login : CREATOR_ROUTES.login;
}

function BrandMark() {
  return (
    <div
      className="flex size-7 items-center justify-center rounded-xl bg-brand-lime shadow-xs"
      aria-hidden
    >
      <div className="size-2.5 rounded-full bg-brand-pine-deep" />
    </div>
  );
}

export default function LoginPanel({
  role,
  brandName = 'sparkory',
  eyebrow = 'WELCOME BACK',
  heroTitle = 'Ideas grow when you show up.',
  heroDescription = 'Continue creating, reviewing or shaping the next opportunity.',
  footer = 'Sparkory community platform',
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

  const loginPath = loginForRole(role);
  const forgotPasswordPath = CREATOR_ROUTES.forgotPassword;

  const onSubmit = async (values: LoginFormValues) => {
    resetLoginError();
    try {
      await login(values, { asRole: role });
      navigate({ to: homeForRole(role), replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  return (
    <section className="relative flex min-h-svh w-full flex-col justify-between overflow-y-auto bg-[#f8faf9] font-jakarta md:min-h-0 md:w-1/2 md:items-center md:justify-center md:bg-surface-subtle md:p-12 lg:p-14">
      {/* Mobile Top Navigation Bar */}
      <header className="flex w-full items-center justify-between px-5 pt-5 pb-3 md:hidden">
        <Link
          to={loginPath}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-gray-300 hover:text-gray-950 no-underline"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-sm font-bold tracking-tight text-gray-900 lowercase">
            {brandName}
          </span>
        </div>
      </header>

      {/* Main Interaction Area */}
      <main className="flex w-full flex-1 flex-col justify-start px-4 pb-8 sm:px-6 md:flex-initial md:max-w-sm md:p-0">
        {/* Mobile Brand Hero Card */}
        <section className="relative mt-2 mb-6 overflow-hidden rounded-3xl bg-brand-pine-deep p-6 text-white shadow-lg shadow-brand-pine-deep/10 sm:p-7 md:hidden">
          {/* Ambient Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-10 size-44 rounded-full bg-brand-forest/60 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-2 right-4 text-brand-lime opacity-10"
          >
            <svg className="size-32" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="6" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col">
            {/* Eyebrow indicator */}
            <div className="mb-4 inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 rounded-full bg-brand-lime animate-pulse"
              />
              <span className="text-[11px] font-bold tracking-widest uppercase text-brand-lime">
                {eyebrow}
              </span>
            </div>
            {/* Hero Headline */}
            <h1 className="mb-3 text-2xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-3xl">
              {heroTitle}
            </h1>
            {/* Supporting text */}
            <p className="text-sm font-normal leading-relaxed text-gray-300">
              {heroDescription}
            </p>
          </div>
        </section>

        {/* Desktop-only: Back to home link */}
        <div className="mb-8 hidden md:block">
          <Link
            to={loginPath}
            className="inline-flex items-center gap-2 rounded-full border border-[#c1c8c3] bg-white px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Sign In Form Container (Card on mobile, flat on desktop) */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-7 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl md:font-bold">
              Sign in
            </h2>
            <p className="mt-1 text-xs text-gray-500 md:text-sm md:text-muted-foreground">
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Input
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Email"
                showRequiredIndicator={false}
                labelClassName="text-xs font-semibold text-gray-700 tracking-wide mb-1.5"
                className="bg-white border-gray-300 rounded-xl px-4 py-3 text-base md:text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-gray-400"
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
                placeholder="Password"
                showRequiredIndicator={false}
                labelClassName="text-xs font-semibold text-gray-700 tracking-wide mb-1.5"
                className="bg-white border-gray-300 rounded-xl pl-4 pr-11 py-3 text-base md:text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-gray-400"
                errorMessage={errors.password?.message}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex items-center justify-center text-gray-400 transition-colors hover:text-gray-600 cursor-pointer pr-1"
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
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-pine text-sm font-semibold text-white transition-all shadow-xs hover:bg-brand-pine-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
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
                className="cursor-pointer text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 no-underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Mobile Footer */}
      <footer className="w-full py-4 text-center px-4 md:hidden">
        <p className="text-[11px] font-medium text-gray-400 tracking-wide">
          {footer}
        </p>
      </footer>
    </section>
  );
}