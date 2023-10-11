import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/hooks/use-current-user';
import { usePathWithSearchParams } from '@/hooks/use-path-with-search-params';

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
  const path = usePathWithSearchParams();
  const { isAuthWithProfile } = useCurrentUser();

  const requireLogin = (fn: () => void, overrides?: UseLoginRedirectProps) => {
    if (!isAuthWithProfile) {
      void router.push(
        getLoginLink({
          redirectUrl: overrides?.redirectUrl ?? redirectUrl ?? path,
          reason: overrides?.reason ?? reason,
        })
      );
    } else {
      fn();
    }
  };

  return { requireLogin };
}
