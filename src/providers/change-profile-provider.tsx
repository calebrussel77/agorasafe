import { initializeProfileStore } from '@/stores/profile-store';
import dynamic from 'next/dynamic';
import React, { type FC, type ReactNode } from 'react';

import { Modal } from '@/components/ui/modal';

import { useCurrentUser } from '@/hooks/use-current-user';

const DynamicChangeProfileModal = dynamic(() =>
  import('@/features/profiles').then(mod => mod.ChangeProfileModal)
);

interface ChangeProfileProviderProps {
  children?: ReactNode;
}

const ChangeProfileProvider: FC<ChangeProfileProviderProps> = ({
  children,
}) => {
  const { status, hasCurrentProfile, resetProfile } = useCurrentUser();

  // reset profile store on sign out
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      initializeProfileStore().persist.clearStorage();
      resetProfile();
    }
  }, [resetProfile, status]);

  const isOpened = status === 'authenticated' && !hasCurrentProfile;

  // if (status === 'loading') return <FullSpinner isFullPage />;

  return isOpened ? (
    <Modal defaultOpen={true} isFullScreen>
      <DynamicChangeProfileModal />
    </Modal>
  ) : (
    children
  );
};

export { ChangeProfileProvider };
