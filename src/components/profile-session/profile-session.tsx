import { initializeProfileStore } from '@/stores/profile-store';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Avatar } from '../ui/avatar';
import { NoSSR } from '../ui/no-ssr';
import { ToastAction, toast } from '../ui/toast';

const ProfileSession = () => {
  const {
    session,
    status,
    updateProfile,
    hasCurrentProfile,
    resetProfile,
    profile,
  } = useCurrentUser();
  const { pathname } = useRouter();
  const isOnboardingPages = pathname.startsWith('/onboarding');
  const [shouldDisplayModal, setShouldDisplayModal] = useState(false);

  // reset profile store on sign out
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      initializeProfileStore().persist.clearStorage();
      resetProfile();
    }
  }, [resetProfile, status]);

  React.useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.hasBeenOnboarded === true &&
      !hasCurrentProfile &&
      !isOnboardingPages
    ) {
      setShouldDisplayModal(true);
    }
  }, [
    hasCurrentProfile,
    isOnboardingPages,
    session?.user?.hasBeenOnboarded,
    status,
  ]);

  const closeModale = () => {
    setShouldDisplayModal(false);
  };

  if (status === 'loading') return <></>;

  return (
    <NoSSR>
      {shouldDisplayModal ? (
        <ChooseProfileModale {...{ updateProfile, closeModale, session }} />
      ) : null}
    </NoSSR>
  );
};

export { ProfileSession };
