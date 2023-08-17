import { useProfileStore } from '@/stores/profiles';
import * as Sentry from '@sentry/nextjs';
import { signIn, signOut } from 'next-auth/react';

import { wait } from '@/utils/misc';

export const useAuth = () => {
  const { profile, setProfile, reset } = useProfileStore();

  const onSignOut = async () => {
    await signOut();
    //Due to next-auth sign out duration
    await wait(100);
    reset();
  };

  const onGooleSignIn = async (opts?: {
    redirectUrl?: string;
    redirect?: boolean;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onSeatled?: () => void;
  }) => {
    try {
      await signIn('google', {
        callbackUrl: opts?.redirectUrl,
        redirect: opts?.redirect || false,
      });
      opts?.onSuccess && opts?.onSuccess();
    } catch (e) {
      Sentry.captureException(e);
      opts?.onError && opts?.onError(e);
    } finally {
      opts?.onSeatled && opts?.onSeatled();
    }
  };

  return {
    profile,
    setProfile,
    reset,
    onSignOut,
    onGooleSignIn,
  };
};
