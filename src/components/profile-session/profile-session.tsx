import { useProfileStore } from '@/stores/profiles';
import { useSession } from 'next-auth/react';
import React, { type ComponentType, type ReactNode } from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { SessionExpirationDialog } from '../session-expiration-modal';

type ComponentProps = {
  children: ReactNode;
};

const ProfileSession = ({ children }: ComponentProps) => {
  const { data: session, status } = useSession();
  const { isSessionExpired, setProfile, setIsSessionExpired, profile } =
    useProfileStore();
  const shouldOpenChooseProfileDialog =
    status === 'authenticated' && !profile && !isSessionExpired;

  return (
    <>
      {isSessionExpired && (
        <SessionExpirationDialog setIsSessionExpired={setIsSessionExpired} />
      )}
      {shouldOpenChooseProfileDialog && (
        <ChooseProfileModale
          session={session}
          {...{ setProfile, setIsSessionExpired }}
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
