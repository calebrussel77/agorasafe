import { usePathname, useRouter } from 'next/navigation';
import React, { type MouseEvent, type MouseEventHandler } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

import { type UseLoginRedirectProps } from '../hooks/use-login-redirect';
import { getLoginLink } from '../utils';
import { usePathWithSearchParams } from '@/hooks/use-path-with-search-params';

export type Props = UseLoginRedirectProps & {
  children: React.ReactElement<{ onClick?: MouseEventHandler<HTMLElement> }>;
  onRedirect?: () => void;
};

export function LoginRedirect({
  children,
  reason,
  redirectUrl,
  onRedirect,
}: Props) {
  const router = useRouter();
  const path = usePathWithSearchParams()
  const { isAuthWithProfile } = useCurrentUser();

  return !isAuthWithProfile
    ? React.cloneElement(children, {
        ...children.props,
        onClick: (e: MouseEvent<HTMLElement>) => {
          e.preventDefault();
          void router.push(
            getLoginLink({ redirectUrl: redirectUrl ?? path, reason })
          );
          onRedirect && onRedirect();
        },
      })
    : children;
}
