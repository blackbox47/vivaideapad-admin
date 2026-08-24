import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/auth/use-auth';
import { ADMIN_ROUTES } from '@/utils/constants/routes';

interface LocationState {
  from?: { pathname: string };
}

interface DemoOption {
  id: 'admin' | 'contributor';
  label: string;
  email: string;
}

const DEMO_OPTIONS: DemoOption[] = [
  {
    id: 'contributor',
    label: 'Contributor demo',
    email: 'nora@sparkory.demo',
  },
  {
    id: 'admin',
    label: 'Admin demo',
    email: 'maya@ideapad.app',
  },
];

const DEFAULT_EMAIL = 'nora@sparkory.demo';
const DEFAULT_PASSWORD = 'demo1234';

const fieldClassName =
  'h-auto w-full rounded-[12px] border-[#dfe7e3] bg-white px-[14px] py-[13px] text-sm shadow-none focus-visible:border-[#70a28d] focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_#e2f1ea]';

export default function LoginPanel() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, isLoggingIn, loginError, resetLoginError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ??
    ADMIN_ROUTES.dashboard;

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
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch {
      // Failure surfaced via loginError.
    }
  };

  const handleDemo = (option: DemoOption) => {
    setEmail(option.email);
    setPassword(DEFAULT_PASSWORD);
    setValidationError(null);
    resetLoginError();
    void login({ email: option.email, password: DEFAULT_PASSWORD })
      .then(() => {
        navigate(redirectTo, { replace: true });
      })
      .catch(() => undefined);
  };

  const inlineError = validationError ?? loginError;

  return (
    <section className="flex min-h-svh items-center justify-center bg-[#f6f8f5] p-11 lg:min-h-0">
      <div className="w-full max-w-[380px]">
        <Link
          to={ADMIN_ROUTES.login}
          className="inline-flex items-center rounded-full border border-[#dfe7e3] bg-white px-3.5 py-2 text-[13px] font-bold text-foreground no-underline transition-colors hover:bg-white"
        >
          ← Back to home
        </Link>

        <span className="mt-[35px] block text-[12px] font-extrabold tracking-[0.12em] text-[#527065] uppercase">
          Secure access
        </span>
        <h2 className="mt-2 mb-2 font-heading text-[38px] tracking-[-0.035em] text-[#12231f]">
          Sign in
        </h2>
        <p className="text-[#687773]">
          Use a demo role below or enter your account details.
        </p>

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

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {DEMO_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleDemo(option)}
              disabled={isLoggingIn}
              className="rounded-[12px] border border-[#dfe7e3] bg-[#f6f8f5] px-3 py-3 text-[13px] font-bold text-[#12231f] transition-colors hover:bg-[#edf1ec] disabled:opacity-60"
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="mt-[22px] text-center text-[12px] text-[#687773]">
          Approved contributors receive a secure activation link by email.
        </p>
      </div>
    </section>
  );
}
