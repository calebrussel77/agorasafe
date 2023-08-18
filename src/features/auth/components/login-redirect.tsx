import { useRouter } from 'next/router';
import React, { type MouseEvent, type MouseEventHandler } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

import { type UseLoginRedirectProps } from '../hooks/use-login-redirect';
import { getLoginLink } from '../utils';

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
  const { isAuthWithProfile } = useCurrentUser();

  return !isAuthWithProfile
    ? React.cloneElement(children, {
        ...children.props,
        onClick: (e: MouseEvent<HTMLElement>) => {
          e.preventDefault();
          void router.push(
            getLoginLink({ redirectUrl: redirectUrl ?? router.asPath, reason })
          );
          onRedirect && onRedirect();
        },
      })
    : children;
}
