import React from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

const ProfileSession = () => {
  const { isAuth, session, updateProfile, hasCurrentProfile } =
    useCurrentUser();

  return (
    <>
      {isAuth && session?.user?.hasBeenOnboarded && !hasCurrentProfile && (
        <ChooseProfileModale {...{ updateProfile, session }} />
      )}
    </>
  );
};

export { ProfileSession };
