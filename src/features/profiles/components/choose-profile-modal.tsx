import { type ProfileStore } from '@/stores/profile-store';
import { type Session } from 'next-auth';

import { Redirect } from '@/components/redirect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { generateArray, wait } from '@/utils/misc';

import { useUserProfiles } from '../services';
import { type CurrentProfile } from '../types';
import { ProfileItemSkeleton } from './profile-item-skeleton';

type ChooseProfileModaleProps = {
  updateProfile: ProfileStore['setProfile'];
  session: Session | null;
};

const ChooseProfileModale = ({
  session,
  updateProfile,
}: ChooseProfileModaleProps) => {
  const { toast } = useToast();

  // profiles query
  const { data, isFetching, error, refetch } = useUserProfiles({
    enabled: !!session?.user,
  });

  const onProfileClick = async (profile: CurrentProfile) => {
    updateProfile(profile);
    await wait(350);
    toast({
      variant: 'success',
      description: (
        <p>
          Vous interagissez maintenant en tant que{' '}
          <span className="font-semibold">{profile?.name}</span>
        </p>
      ),
    });
  };

  if (session && data?.profiles?.length === 0) {
    return <Redirect to="/onboarding/choose-profile-type" />;
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl">
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
              {isFetching
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
                      <Typography truncate as="h3" className="mt-3">
                        {profile.name}
                      </Typography>
                      <UserBadge
                        className="mt-1 line-clamp-1"
                        type={profile.type}
                      />
                    </button>
                  ))}
            </div>
            <Skeleton
              isVisible={isFetching}
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
      </DialogContent>
    </Dialog>
  );
};

export { ChooseProfileModale };
