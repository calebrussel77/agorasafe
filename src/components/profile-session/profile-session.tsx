import { initializeProfileStore } from '@/stores/profile-store';
import React from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { NoSSR } from '../ui/no-ssr';

const ProfileSession = () => {
  const {
    session,
    status,
    updateProfile,
    hasCurrentProfile,
    resetProfile,
    profile,
  } = useCurrentUser();

  // reset profile store on sign out
  React.useEffect(() => {
    if (status === 'loading' || status === 'authenticated') return;

    if (status === 'unauthenticated') {
      initializeProfileStore().persist.clearStorage();
    }
  }, [status]);

  return (
    <NoSSR>
      {status === 'authenticated' &&
      session?.user?.hasBeenOnboarded === true &&
      !hasCurrentProfile ? (
        <ChooseProfileModale
          {...{ updateProfile, resetProfile, session, profile }}
        />
      ) : null}
    </NoSSR>
  );
};

export { ProfileSession };
