import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'react-toastify';
import { useMountedState } from 'react-use';

import { Redirect } from '@/components/redirect';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { Notification } from '@/components/ui/notification';
import { Skeleton } from '@/components/ui/skeleton';
import { FullSpinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { ProfileItemSkeleton, useUserProfiles } from '@/features/profiles';

import { type CurrentProfile } from '@/types/profiles';

import { generateArray } from '@/utils/misc';

// Define a type for the component props
type ComponentProps = {
  profile: CurrentProfile;
} & unknown;

// Define a higher-order component for profile check
const withProfile = (WrappedComponent: React.ComponentType<ComponentProps>) => {
  const WrapperComponent: React.FC<ComponentProps> = props => {
    const { data: session, status } = useSession();
    const isMounted = useMountedState();

    // profile store
    const profileStore = useProfileStore();

    // profiles query
    const { data, isFetching, error, refetch } = useUserProfiles({
      enabled: !!session?.user,
    });

    const onProfileClick = (profile: CurrentProfile) => {
      useProfileStore.setState({
        profile,
      });
      toast(
        <Notification
          variant="success"
          title={
            <p className="text-sm font-normal">
              Vous interagissez maintenant en tant que{' '}
              <span className="font-semibold">{profile?.name}</span>
            </p>
          }
        />
      );
    };

    if (status === 'loading') {
      return <FullSpinner />;
    }

    if (isMounted() && session && data?.profiles?.length === 0) {
      return <Redirect to="/choose-profile-type" />;
    }

    if (error) {
      return (
        <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center">
          <SectionError error={error} onRetry={() => void refetch()} />{' '}
        </div>
      );
    }

    if (session && !profileStore.profile && isMounted()) {
      return (
        <div className="container flex min-h-screen w-full max-w-6xl flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-semibold">
            Avec qui souhaitez-vous continuer ?
          </h1>
          <p className="w-full max-w-md text-center text-muted-foreground">
            {data?.message}
          </p>
          <ErrorWrapper>
            <div className="mt-6 flex w-full flex-wrap items-start justify-center gap-1 pb-8 sm:gap-4">
              {isFetching
                ? generateArray(4).map(el => <ProfileItemSkeleton key={el} />)
                : data?.profiles?.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => onProfileClick(profile)}
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
        </div>
      );
    }

    // Render the wrapped component if all is successful
    return <WrappedComponent {...props} profile={profileStore.profile} />;
  };

  return WrapperComponent;
};

export { withProfile };
