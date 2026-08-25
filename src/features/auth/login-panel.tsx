import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/auth/use-auth';
import type { UserRole } from '@/models/auth/auth-model';
import { ADMIN_ROUTES, CREATOR_ROUTES } from '@/utils/constants/routes';

const fieldClassName =
  'h-auto w-full rounded-[12px] border-[#dfe7e3] bg-white px-[14px] py-[13px] text-sm shadow-none focus-visible:border-[#70a28d] focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_#e2f1ea]';

interface LoginPanelProps {
  role: UserRole;
}

function homeForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.dashboard : CREATOR_ROUTES.dashboard;
}

function loginForRole(role: UserRole): string {
  return role === 'admin' ? ADMIN_ROUTES.login : CREATOR_ROUTES.login;
}

function titleForRole(role: UserRole): string {
  return role === 'admin' ? 'Sign in' : 'Sign in to your creator workspace';
}

function descriptionForRole(role: UserRole): string {
  return role === 'admin'
    ? 'Enter your account details to continue.'
    : 'Pick a topic, share your idea, and track it from draft to payout.';
}

export default function LoginPanel({ role }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();

  const loginPath = loginForRole(role);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (loginError || validationError) {
      resetLoginError();
      setValidationError(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (loginError || validationError) {
      resetLoginError();
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!password.trim()) {
      setValidationError('Password is required');
      return;
    }

    try {
      // Trust the panel's `role` over the server's claim. The panel knows it
      // was mounted on `/login` (creator) or `/admin/login` (admin), so we
      // pin the role claim in the auth slice accordingly. This matches the
      // way we navigate below.
      await login({ email, password }, { asRole: role });
      navigate(homeForRole(role), { replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  const inlineError = validationError ?? loginError;

  return (
    <section className="flex min-h-svh items-center justify-center bg-[#f6f8f5] p-11 lg:min-h-0">
      <div className="w-full max-w-[380px]">
        <Link
          to={loginPath}
          className="inline-flex items-center rounded-full border border-[#dfe7e3] bg-white px-3.5 py-2 text-[13px] font-bold text-foreground no-underline transition-colors hover:bg-white"
        >
          ← Back to home
        </Link>

        <span className="mt-[35px] block text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
          Secure access
        </span>
        <h2 className="mt-2 mb-2 font-heading text-[38px] tracking-[-0.035em] text-[#12231f]">
          {titleForRole(role)}
        </h2>
        <p className="text-[#687773]">{descriptionForRole(role)}</p>

        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <div className="mb-3.5">
            <Label
              htmlFor="email"
              className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              autoComplete="username"
              aria-invalid={Boolean(inlineError)}
              className={fieldClassName}
            />
          </div>

          <div className="mb-[18px]">
            <Label
              htmlFor="password"
              className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(inlineError)}
              className={fieldClassName}
            />
          </div>

          {inlineError ? (
            <p
              className="mb-3 text-[12px] font-semibold text-[#b3401f]"
              role="alert"
            >
              {inlineError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="h-auto w-full rounded-full bg-[#12231f] px-5 py-[14px] text-sm font-bold text-white hover:bg-[#254b40] disabled:opacity-60"
          >
            {isLoggingIn ? 'Signing in…' : 'Continue'}
          </Button>
        </form>

        <p className="mt-[22px] text-center text-[12px] text-[#687773]">
          Approved contributors receive a secure activation link by email.
        </p>
      </div>
    </section>
  );
}