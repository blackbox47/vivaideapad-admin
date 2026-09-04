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
}

function homeForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.dashboard : CREATOR_ROUTES.dashboard;
}

function loginForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.login : CREATOR_ROUTES.login;
}

export default function LoginPanel({
  role,
  brandName = 'sparkory',
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
          to={loginPath}
          className="inline-flex items-center gap-2 rounded-full border border-[#c1c8c3] bg-white px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>

        {/* Header */}
        <div className="mt-10 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Sign in
          </h2>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="Email"
              showRequiredIndicator={false}
              labelClassName="text-xs font-semibold text-foreground mb-1.5"
              className="bg-white border-[#c1c8c3] rounded-lg px-4 py-3 text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-muted-foreground"
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
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-pine py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-pine-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="mt-6 text-center">
            <Link
              to={forgotPasswordPath}
              className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground no-underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}