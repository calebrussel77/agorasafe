import dynamic from 'next/dynamic';
import React, { type FC, type ReactNode } from 'react';
import { useMountedState } from 'react-use';

import { Modal } from '@/components/ui/modal';
import { FullSpinner } from '@/components/ui/spinner';

import { useCurrentUser } from '@/hooks/use-current-user';

const DynamicUserOnBoardingModal = dynamic(() =>
  import('@/features/user-onboarding').then(mod => mod.UserOnboardingModal)
);

interface UserOnboardingProviderProps {
  children?: ReactNode;
}

const UserOnboardingProvider: FC<UserOnboardingProviderProps> = ({
  children,
}) => {
  const { profile, session, status } = useCurrentUser();

  const isOpened =
    session?.user &&
    !profile &&
    (!session?.user?.tos || !session?.user?.onboardingComplete);

  if (status === 'loading') return <FullSpinner isFullPage />;

  return isOpened ? (
    <Modal defaultOpen={true} isFullScreen>
      <DynamicUserOnBoardingModal />
    </Modal>
  ) : (
    children
  );
};

export { UserOnboardingProvider };
