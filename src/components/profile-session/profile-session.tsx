import React from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

const ProfileSession = () => {
  const { isAuth, session, updateProfile, hasCurrentProfile, resetProfile } =
    useCurrentUser();

  // reset profile store on sign out
  React.useEffect(() => {
    if (!session?.user) {
      resetProfile();
    }
  }, [session?.user]);

  return (
    <>
      {isAuth && session?.user?.hasBeenOnboarded && !hasCurrentProfile && (
        <ChooseProfileModale {...{ updateProfile, resetProfile, session }} />
      )}
    </>
  );
};

export { ProfileSession };
