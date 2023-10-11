import { useRouter } from 'next/router';

import { useCurrentUser } from '@/hooks/use-current-user';

import { type LoginRedirectReason, getLoginLink } from '../utils';

export type UseLoginRedirectProps = {
  reason: LoginRedirectReason;
  redirectUrl?: string;
};

export function useLoginRedirect({
  reason,
  redirectUrl,
}: UseLoginRedirectProps) {
  const router = useRouter();
  const { isAuthWithProfile } = useCurrentUser();

  const requireLogin = (fn: () => void, overrides?: UseLoginRedirectProps) => {
    if (!isAuthWithProfile) {
      void router.push(
        getLoginLink({
          redirectUrl: overrides?.redirectUrl ?? redirectUrl ?? router.asPath,
          reason: overrides?.reason ?? reason,
        })
      );
    } else {
      fn();
    }
  };

  return { requireLogin };
}
