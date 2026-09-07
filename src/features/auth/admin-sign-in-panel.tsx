import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/auth/use-auth';
import {
  adminSignInSchema,
  type AdminSignInFormValues,
} from '@/models/auth/auth-schema';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

interface AdminSignInPanelProps {
  brandName?: string;
}

export default function AdminSignInPanel({
  brandName = 'sparkory',
}: AdminSignInPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: AdminSignInFormValues) => {
    resetLoginError();
    try {
      await login(values, { asRole: 'admin' });
      // Always land on the admin dashboard after sign-in.
      navigate({ to: ADMIN_ROUTES.dashboard, replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  return (
    <section className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-y-auto bg-surface-subtle p-6 font-jakarta md:min-h-0 md:w-1/2 md:p-12 lg:p-14">
      <div className="w-full max-w-sm">
        {/* Mobile-only brand badge (when left hero panel is hidden) */}
        <div className="mb-6 flex items-center gap-2.5 md:hidden">
          <div className="flex size-9 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-brand-lime">
            <div className="size-2.5 rounded-full bg-brand-pine-deep" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground lowercase">
            {brandName}
          </span>
        </div>

        {/* Back to Home */}
        <Link
          to={CREATOR_ROUTES.login}
          className="inline-flex items-center gap-2 rounded-full border border-[#c1c8c3] bg-white px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>

        {/* Header */}
        <div className="mt-10 mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-pine-deep/20 bg-brand-pine-deep/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-brand-pine-deep uppercase">
            <span className="size-1.5 rounded-full bg-brand-lime" />
            <span>SECURE ACCESS • RESTRICTED</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Admin Sign In
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your administrative credentials to access the console.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Input
              id="admin-email"
              label="Admin work email"
              type="email"
              autoComplete="email"
              placeholder="admin@sparkory.com"
              showRequiredIndicator={false}
              labelClassName="text-xs font-semibold text-foreground mb-1.5"
              className="bg-white border-[#c1c8c3] rounded-lg px-4 py-3 text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-muted-foreground"
              errorMessage={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div>
            <Input
              id="admin-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter admin password"
              showRequiredIndicator={false}
              labelClassName="text-xs font-semibold text-foreground mb-1.5"
              className="bg-white border-[#c1c8c3] rounded-lg px-4 py-3 text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-muted-foreground"
              errorMessage={errors.password?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberWorkstation}
                onChange={(e) => setRememberWorkstation(e.target.checked)}
                className="size-4 rounded border-[#c1c8c3] text-brand-pine focus:ring-brand-pine-deep/20"
              />
              <span className="text-muted-foreground">
                Remember workstation (30 days)
              </span>
            </label>
            <Link
              to={CREATOR_ROUTES.forgotPassword}
              className="text-muted-foreground transition-colors hover:text-foreground no-underline"
            >
              Forgot admin password?
            </Link>
          </div>

          {loginError ? (
            <div
              className="rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive"
              role="alert"
            >
              {loginError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-pine py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-pine-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <Lock className="size-4" />
                <span>Sign in to Console</span>
              </>
            )}
          </button>

          <div className="mt-6 border-t border-border/60 pt-5 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Looking for contributor login?{' '}
              <Link
                to={CREATOR_ROUTES.login}
                className="font-bold text-foreground hover:underline"
              >
                Switch to Contributor Portal
              </Link>
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-white px-3 py-1.5 text-left shadow-2xs">
              <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-[11px] leading-tight text-muted-foreground">
                Secured with enterprise SSO & RBAC protection
              </span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

