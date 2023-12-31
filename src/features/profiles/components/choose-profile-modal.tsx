import { type ProfileStore } from '@/stores/profile-store';
import { type Session } from 'next-auth';
import { useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { UserAvatar, UserName } from '@/components/user';

import { api } from '@/utils/api';
import { generateArray } from '@/utils/misc';
import { invalidateModeratedContent } from '@/utils/query-invalidation';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useIsMobile } from '@/hooks/use-breakpoints';

import { useUserProfiles } from '../services';
import { ProfileItemSkeleton } from './profile-item-skeleton';

type ChooseProfileModaleProps = {
  session: Session | null;
  closeModale: () => void;
  updateProfile: ProfileStore['setProfile'];
};

const ChooseProfileModale = ({
  session,
  closeModale,
  updateProfile,
}: ChooseProfileModaleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryUtils = api.useContext();
  const isMobile = useIsMobile();

  // profiles query
  const { data, isInitialLoading, error, refetch } = useUserProfiles({
    enabled: !!session?.user,
    staleTime: 60 * 1000,
  });

  const onProfileClick = async (profile: SimpleProfile) => {
    setIsLoading(true);
    updateProfile(profile);
    await invalidateModeratedContent(queryUtils);
    toast({
      delay: 3000,
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
    });
    setIsLoading(false);
    closeModale();
  };

  return (
    <Modal open={true} isFullScreen>
      <CenterContent className="w-full">
        <h1 className="text-center text-2xl font-semibold lg:text-3xl">
          Avec qui souhaitez-vous continuer ?
        </h1>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Spinner variant="primary" size="lg" />
            <p className="mt-2 text-center">Chargement du nouveau profil...</p>
          </div>
        ) : (
          <ErrorWrapper
            error={error}
            errorComponent={
              <SectionError error={error} onRetry={() => void refetch()} />
            }
          >
            <p className="w-full max-w-md text-center text-muted-foreground">
              {data?.message}
            </p>
            <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-1 pb-8 sm:gap-4">
              {isInitialLoading
                ? generateArray(2).map(el => <ProfileItemSkeleton key={el} />)
                : data?.profiles?.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => void onProfileClick(profile)}
                      className="group flex flex-col items-center justify-center rounded-md px-3 py-6 hover:bg-gray-100"
                    >
                      <UserAvatar
                        profile={profile}
                        className="aspect-square h-16 w-16 shadow-md sm:h-20 sm:w-20"
                      />
                      <UserName
                        profile={profile}
                        classNames={{ root: 'mt-3', text: 'text-lg' }}
                        withProfileBadgeInitial={isMobile}
                      />
                      <Typography truncate variant="small" className="mt-1">
                        {profile.location?.name}
                      </Typography>
                    </button>
                  ))}
            </div>
            {/* //TODO: Manage user profiles */}
            <Skeleton
              isVisible={isInitialLoading}
              className="aspect-square h-10 w-40"
            >
              <Button
                aria-label="Naviguer vers la page de gestion des comptes"
                variant="outline"
              >
                Gérer vos profils
              </Button>
            </Skeleton>
          </ErrorWrapper>
        )}
      </CenterContent>
    </Modal>
  );
};

export { ChooseProfileModale };
