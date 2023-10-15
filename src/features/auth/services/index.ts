import { initializeProfileStore } from '@/stores/profile-store';
import { signIn, signOut } from 'next-auth/react';

import { sentryCaptureException } from '@/lib/sentry';

export const useAuth = () => {
  const onSignOut = () => {
    signOut({ callbackUrl: '/' })
      .then(() => {
        initializeProfileStore().persist.clearStorage();
      })
      .catch(e => console.error(e));
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
