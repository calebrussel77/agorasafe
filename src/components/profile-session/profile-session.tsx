import React, { type ComponentType, type ReactNode } from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { SessionExpirationDialog } from '../session-expiration-modal';

type ComponentProps = {
  children: ReactNode;
};

const ProfileSession = ({ children }: ComponentProps) => {
  const {
    session,
    isAuth,
    isSessionExpired,
    updateProfile,
    updateIsSessionExpired,
    profile,
  } = useCurrentUser();

  const shouldOpenChooseProfileDialog = isAuth && !profile && !isSessionExpired;

  return (
    <>
      {isSessionExpired && (
        <SessionExpirationDialog
          updateIsSessionExpired={updateIsSessionExpired}
        />
      )}
      {shouldOpenChooseProfileDialog && (
        <ChooseProfileModale
          session={session}
          {...{ updateProfile, updateIsSessionExpired }}
        />
      )}
      {children}
    </>
  );
};

//For specific components purpose
const withProfileSession =
  <T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) =>
  // eslint-disable-next-line react/display-name
  (hocProps: T) =>
    (
      <ProfileSession>
        <Component {...hocProps} />
      </ProfileSession>
    );

export { ProfileSession, withProfileSession };
