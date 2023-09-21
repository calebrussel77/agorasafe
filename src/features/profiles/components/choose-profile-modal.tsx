import { type ProfileStore } from '@/stores/profile-store';
import { type Session } from 'next-auth';

import { Button } from '@/components/ui/button';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { generateArray } from '@/utils/misc';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useUserProfiles } from '../services';
import { ProfileItemSkeleton } from './profile-item-skeleton';

type ChooseProfileModaleProps = {
  session: Session | null;
  reloadWithToast: () => void;
  updateProfile: ProfileStore['setProfile'];
};

const ChooseProfileModale = ({
  session,
  reloadWithToast,
  updateProfile,
}: ChooseProfileModaleProps) => {
  // profiles query
  const { data, isInitialLoading, error, refetch } = useUserProfiles({
    enabled: !!session?.user,
    staleTime: 60 * 1000,
  });

  const onProfileClick = (profile: SimpleProfile) => {
    updateProfile(profile);
    reloadWithToast();
  };

  return (
    <Modal classNames={{ root: 'max-w-2xl' }} open={true}>
      <CenterContent className="w-full">
        <h1 className="text-center text-3xl font-semibold">
          Avec qui souhaitez-vous continuer ?
        </h1>
        <ErrorWrapper
          error={error}
          errorComponent={
            <SectionError error={error} onRetry={() => void refetch()} />
          }
        >
          <p className="w-full max-w-md text-center text-muted-foreground">
            {data?.message}
          </p>
          <div className="mt-10 flex w-full flex-wrap items-start justify-center gap-1 pb-8 sm:gap-4">
            {isInitialLoading
              ? generateArray(4).map(el => <ProfileItemSkeleton key={el} />)
              : data?.profiles?.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => void onProfileClick(profile)}
                    className="group flex w-full max-w-[250px] flex-col items-center justify-center rounded-md p-3 hover:bg-gray-100"
                  >
                    <UserAvatar
                      src={profile.avatar as string}
                      alt={profile.name}
                      type={profile.type}
                      className="aspect-square h-20 w-20 shadow-md sm:h-24 sm:w-24"
                    />
                    <div className="mt-3 flex items-start gap-1.5">
                      <Typography truncate as="h3">
                        {profile.name}
                      </Typography>
                      <UserBadge className="line-clamp-1" type={profile.type} />
                    </div>
                    <Typography truncate variant="small" className="mt-1">
                      {profile.location?.name}
                    </Typography>
                  </button>
                ))}
          </div>
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
      </CenterContent>
    </Modal>
  );
};

export { ChooseProfileModale };
