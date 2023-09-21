import { initializeProfileStore } from '@/stores/profile-store';
import { type Session } from 'next-auth';
import { type SessionContextValue } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

import { ChooseProfileModale } from '@/features/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useToastOnPageReload } from '@/hooks/use-toast-on-page-reload';

import { Avatar } from '../ui/avatar';
import { NoSSR } from '../ui/no-ssr';
import { ToastAction, useToast } from '../ui/toast';

const shouldDisplayProfileDialog = ({
  status,
  session,
  hasCurrentProfile,
  isOnboardingPages,
}: {
  status: SessionContextValue['status'];
  session: Session | null;
  hasCurrentProfile: boolean;
  isOnboardingPages: boolean;
}) => {
  return (
    status === 'authenticated' &&
    session?.user?.hasBeenOnboarded === true &&
    !hasCurrentProfile &&
    !isOnboardingPages
  );
};

const ProfileSession = () => {
  const {
    session,
    status,
    updateProfile,
    hasCurrentProfile,
    resetProfile,
    profile,
  } = useCurrentUser();
  const { toast } = useToast();
  const router = useRouter();
  const isOnboardingPages = router.pathname.startsWith('/onboarding');

  const { reloadWithToast } = useToastOnPageReload(() =>
    toast({
      delay: 4000,
      icon: (
        <Avatar
          isBordered
          className="h-10 w-10"
          src={profile?.avatar as string}
          alt={`Avatar de ${profile?.name}`}
        />
      ),
      variant: 'success',
      description: (
        <p className="text-sm">
          Vous interagissez maintenant en tant que{' '}
          <span className="font-semibold">{profile?.name}</span>
        </p>
      ),
      actions: (
        <ToastAction
          onClick={resetProfile}
          variant="ghost"
          altText="Annuler l'action"
        >
          Annuler
        </ToastAction>
      ),
    })
  );

  // reset profile store on sign out
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      initializeProfileStore().persist.clearStorage();
    }
  }, [status]);

  console.log(
    status === 'authenticated' &&
      session?.user?.hasBeenOnboarded === true &&
      !hasCurrentProfile &&
      !isOnboardingPages,
    'From profile session'
  );

  return (
    <NoSSR>
      {status === 'authenticated' &&
      session?.user?.hasBeenOnboarded === true &&
      !hasCurrentProfile &&
      !isOnboardingPages ? (
        <ChooseProfileModale {...{ updateProfile, reloadWithToast, session }} />
      ) : null}
    </NoSSR>
  );
};

export { ProfileSession };
