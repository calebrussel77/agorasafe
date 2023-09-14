import React from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

const ProfileSession = () => {
  const {
    isAuth,
    session,
    status,
    updateProfile,
    hasCurrentProfile,
    resetProfile,
  } = useCurrentUser();

  // reset profile store on sign out
  React.useEffect(() => {
    if (status === 'loading') return;

    if (!isAuth) {
      resetProfile();
    }
  }, [isAuth, status, resetProfile]);

  if (status === 'loading') return;

  return (
    <>
      {isAuth && session?.user?.hasBeenOnboarded && !hasCurrentProfile && (
        <ChooseProfileModale {...{ updateProfile, resetProfile, session }} />
      )}
    </>
  );
};

export { ProfileSession };
