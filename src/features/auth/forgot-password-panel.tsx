import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/models/auth/auth-schema';
import { useForgotPasswordMutation } from '@/services/auth/auth-service';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface ForgotPasswordPanelProps {
  brandName?: string;
}

export default function ForgotPasswordPanel({
  brandName = 'sparkory',
}: ForgotPasswordPanelProps) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [requestForgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestForgotPassword({ email: values.email }).unwrap();
    } catch {
      // Backend logs the token or ignores non-existent users for security.
    } finally {
      // Always show success to prevent email enumeration.
      setSubmittedEmail(values.email);
    }
  };

  return (
    <section className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-y-auto bg-surface-subtle p-6 font-jakarta md:min-h-0 md:w-1/2 md:p-12 lg:p-14">
      <div className="w-full max-w-sm">
        {/* Mobile-only brand badge */}
        <div className="mb-6 flex items-center gap-2.5 md:hidden">
          <div className="flex size-9 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-br-xs rounded-tl-xs bg-brand-lime">
            <div className="size-2.5 rounded-full bg-brand-pine-deep" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground lowercase">
            {brandName}
          </span>
        </div>

        {/* Back to Sign In Link */}
        <Link
          to={CREATOR_ROUTES.login}
          className="inline-flex items-center gap-2 rounded-full border border-[#c1c8c3] bg-white px-4 py-2 text-xs font-semibold text-foreground no-underline shadow-xs transition-colors hover:bg-neutral-100"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to sign in</span>
        </Link>

        {/* Header */}
        <div className="mt-10 mb-8">
          <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            SECURE ACCESS
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Reset password
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter your email address and we'll send you a link to securely reset your password.
          </p>
        </div>

        {/* Form or Confirmation */}
        {submittedEmail ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3.5 rounded-xl border border-border bg-white p-4.5 shadow-xs">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Check your inbox
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  If an account exists for{' '}
                  <span className="font-semibold text-foreground">
                    {submittedEmail}
                  </span>
                  , you will receive a reset link shortly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedEmail(null)}
              className="w-full cursor-pointer rounded-full border border-border bg-white py-3 text-xs font-semibold text-foreground transition-colors hover:bg-neutral-100"
            >
              Send again with a different email
            </button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Input
                id="reset-email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="nora@sparkory.demo"
                showRequiredIndicator={false}
                labelClassName="text-xs font-semibold text-foreground mb-1.5"
                className="bg-white border-[#c1c8c3] rounded-lg px-4 py-3 text-sm focus-visible:border-brand-pine-deep focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 shadow-none placeholder:text-muted-foreground"
                errorMessage={errors.email?.message}
                {...register('email')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-pine py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-pine-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pine-deep/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Sending link…</span>
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        )}

        {/* Help text */}
        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          If you don't receive an email within a few minutes, please check your spam folder or contact your administrator.
        </p>
      </div>
    </section>
  );
}
