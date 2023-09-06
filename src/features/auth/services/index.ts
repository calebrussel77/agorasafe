import { signIn, signOut } from 'next-auth/react';

import { wait } from '@/utils/misc';

import { sentryCaptureException } from '@/lib/sentry';

export const useAuth = () => {
  const onSignOut = async (fn?: () => void) => {
    await signOut({ callbackUrl: '/' });
    //Due to next-auth sign out duration
    wait(250)
      .then(() => fn && fn())
      .catch(e => console.log(e));
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
      sentryCaptureException(e);
      opts?.onError && opts?.onError(e);
    } finally {
      opts?.onSeatled && opts?.onSeatled();
    }
  };

  return {
    onSignOut,
    onGooleSignIn,
  };
};
