import { useCallback, useState } from 'react';

import type { SignUpResponse } from '@/models/auth/auth-model';
import type { SignUpFormValues } from '@/models/auth/auth-schema';
import {
  useGoogleSignUpMutation,
  useSignUpMutation,
} from '@/services/auth/auth-service';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

export interface UseSignUpResult {
  signUpEmail: (values: SignUpFormValues) => Promise<SignUpResponse>;
  signUpWithGoogle: (credential: string) => Promise<SignUpResponse>;
  isSigningUp: boolean;
  isGoogleSigningUp: boolean;
  submitError: string | null;
  resetSubmitError: () => void;
}

export default function useSignUp(): UseSignUpResult {
  const [signUp, { isLoading }] = useSignUpMutation();
  const [googleSignUp, { isLoading: isGoogleLoading }] = useGoogleSignUpMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const signUpEmail = useCallback(
    async (values: SignUpFormValues): Promise<SignUpResponse> => {
      setSubmitError(null);
      try {
        const res = await signUp({
          full_name: values.fullName.trim(),
          displayName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          consent: true,
        }).unwrap();
        return res;
      } catch (err) {
        const msg = getApiErrorMessage(err);
        setSubmitError(msg);
        throw err;
      }
    },
    [signUp],
  );

  const signUpWithGoogle = useCallback(
    async (credential: string): Promise<SignUpResponse> => {
      setSubmitError(null);
      try {
        const res = await googleSignUp({ credential }).unwrap();
        return res;
      } catch (err) {
        const msg = getApiErrorMessage(err);
        setSubmitError(msg);
        throw err;
      }
    },
    [googleSignUp],
  );

  return {
    signUpEmail,
    signUpWithGoogle,
    isSigningUp: isLoading,
    isGoogleSigningUp: isGoogleLoading,
    submitError,
    resetSubmitError: () => setSubmitError(null),
  };
}
