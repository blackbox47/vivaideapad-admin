import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/models/auth/auth-schema';
import { useResetPasswordMutation } from '@/services/auth/auth-service';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface ResetPasswordPanelProps {
  token: string;
  brandName?: string;
}

const fieldClassName =
  'rounded-lg border-border bg-card px-4 py-3 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20';

export default function ResetPasswordPanel({
  token,
  brandName = 'Viva IdeaPad',
}: ResetPasswordPanelProps) {
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const hasToken = token.trim().length > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setSubmitError(null);
    try {
      await resetPassword({
        token,
        new_password: values.password,
      }).unwrap();
      setDone(true);
    } catch (err) {
      setSubmitError(
        getApiErrorMessage(err) ??
          'This reset link is invalid or has expired. Request a new one.',
      );
    }
  };

  return (
    <section className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-y-auto bg-surface-subtle p-6 font-sans md:min-h-0 md:w-1/2 md:p-12 lg:p-14">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5 md:hidden">
          <div className="flex size-9 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-primary">
            <div className="size-2.5 rounded-full bg-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>

        <Link
          to={CREATOR_ROUTES.login}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to sign in</span>
        </Link>

        <div className="mt-10 mb-8">
          <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
            SECURE ACCESS
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Choose a new password
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Use at least 8 characters with a letter and a number. This link
            expires after one hour.
          </p>
        </div>

        {!hasToken ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4.5 shadow-xs">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Missing reset link
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Open the link from your email, or request a new reset link.
                </p>
              </div>
            </div>
            <Link
              to={CREATOR_ROUTES.forgotPassword}
              className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-brand-forest"
            >
              Request a reset link
            </Link>
          </div>
        ) : done ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4.5 shadow-xs">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Password updated
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  You can sign in with your new password now.
                </p>
              </div>
            </div>
            <Link
              to={CREATOR_ROUTES.login}
              className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-brand-forest"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {submitError ? (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs leading-relaxed text-destructive">
                  {submitError}
                </p>
              </div>
            ) : null}

            <Input
              id="new-password"
              label="New password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              showRequiredIndicator={false}
              labelClassName="mb-1.5 text-xs font-semibold text-foreground"
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
                    <EyeOff className="size-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="size-4 stroke-[1.8]" />
                  )}
                </button>
              }
              {...register('password')}
            />

            <Input
              id="confirm-password"
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter password"
              showRequiredIndicator={false}
              labelClassName="mb-1.5 text-xs font-semibold text-foreground"
              className={`${fieldClassName} pr-11`}
              errorMessage={errors.confirmPassword?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="flex cursor-pointer items-center justify-center pr-1 text-muted-foreground transition-colors hover:text-primary"
                  aria-label={
                    showConfirm ? 'Hide confirm password' : 'Show confirm password'
                  }
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="size-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="size-4 stroke-[1.8]" />
                  )}
                </button>
              }
              {...register('confirmPassword')}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating…</span>
                </>
              ) : (
                'Update password'
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Link expired?{' '}
              <Link
                to={CREATOR_ROUTES.forgotPassword}
                className="font-semibold text-primary no-underline hover:underline"
              >
                Request a new one
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
