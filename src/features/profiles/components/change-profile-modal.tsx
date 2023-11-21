import { useRouter } from 'next/router';
import React, { type FC } from 'react';

import { Button } from '@/components/ui/button';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { UserAvatar, UserName } from '@/components/user';

import { ProfileItemSkeleton, useUserProfiles } from '@/features/profiles';

import { generateArray } from '@/utils/misc';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useIsMobile } from '@/hooks/use-breakpoints';
import { useCurrentUser } from '@/hooks/use-current-user';

interface ChangeProfileModalProps {
  className?: string;
}

const ChangeProfileModal: FC<ChangeProfileModalProps> = ({}) => {
  const { session, updateProfile } = useCurrentUser();
  const router = useRouter();
  const isMobile = useIsMobile();

  // profiles query
  const { data, isInitialLoading, error, refetch } = useUserProfiles({
    enabled: !!session?.user,
    staleTime: 60 * 1000,
  });

  // reloadWithToast();
  const onProfileClick = async (_profile: SimpleProfile) => {
    if (!_profile) return;
    updateProfile(_profile);
    await router.replace(router?.pathname);
    toast({
      delay: 3000,
      icon: <UserAvatar className="h-10 w-10" profile={_profile} />,
      variant: 'success',
      description: (
        <p className="text-sm">
          Vous interagissez maintenant en tant que{' '}
          <span className="font-semibold">{_profile?.name}</span>
        </p>
      ),
    });
  };

  return (
    <CenterContent className="w-full">
      <h1 className="text-center text-2xl font-semibold lg:text-3xl">
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
        <div
          className={cn(
            'mt-6 flex w-full flex-wrap items-end justify-center gap-1 pb-8 sm:gap-4'
          )}
        >
          {isInitialLoading
            ? generateArray(2).map(el => <ProfileItemSkeleton key={el} />)
            : data?.profiles?.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => void onProfileClick(profile)}
                  className="group flex w-full max-w-[250px] flex-col items-center justify-center rounded-md px-3 py-6 hover:bg-gray-100"
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
                    {profile.location?.address}
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
    </CenterContent>
  );
};

export { ChangeProfileModal };
