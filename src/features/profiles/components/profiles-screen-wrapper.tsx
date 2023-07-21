import { useProfileStore } from '@/stores/profiles';
import { useSession } from 'next-auth/react';
import React, { type FC, type ReactNode, useEffect } from 'react';
import { useMountedState } from 'react-use';

import { Animate } from '@/components/ui/animate';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ErrorWrapper } from '@/components/ui/error';
import { Skeleton } from '@/components/ui/skeleton';
import { FullSpinner } from '@/components/ui/spinner';

import { generateArray } from '@/utils/misc';
import { getProfileType } from '@/utils/profile';

import { useUserProfiles } from '../services';
import { ProfileItemSkeleton } from './profile-item-skeleton';

interface ProfilesScreenWrapperProps {
  children: ReactNode;
}

const ProfilesScreenWrapper: FC<ProfilesScreenWrapperProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const isMounted = useMountedState();

  // profile store
  const profileStore = useProfileStore();

  // profiles query
  const { data, isFetching } = useUserProfiles({
    enabled: !!session?.user,
  });

  // reset profile store on sign out
  useEffect(() => {
    if (!session?.user) {
      useProfileStore.persist.clearStorage();
    }
  }, [session?.user]);

  if (status === 'loading') {
    return <FullSpinner />;
  }

  if (session && !profileStore.profile && isMounted()) {
    return (
      <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center">
        <h1 className="text-center text-3xl font-semibold sm:text-4xl">
          Avec qui souhaitez-vous continuer ?
        </h1>
        <ErrorWrapper>
          <Animate className="mt-3 flex flex-wrap items-start justify-center gap-2 pb-8 sm:gap-4 md:gap-8">
            {isFetching
              ? generateArray(4).map(el => <ProfileItemSkeleton key={el} />)
              : data?.profiles?.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      useProfileStore.setState({
                        profile: profile,
                      });
                    }}
                    className="group flex flex-col items-center rounded-md p-3 hover:bg-gray-100"
                  >
                    <Avatar
                      src={profile.avatar as string}
                      alt={profile.name}
                      bordered
                      className="aspect-square h-20 w-20 shadow-md sm:h-24 sm:w-24"
                    />
                    <h3 className="mt-3 line-clamp-1 text-lg font-semibold">
                      {profile.name}
                    </h3>
                    <p className="line-clamp-1">
                      {getProfileType(profile.type)}
                    </p>
                  </button>
                ))}
          </Animate>
          {isFetching ? (
            <Skeleton className="aspect-square h-10 w-40 " />
          ) : (
            <Button
              aria-label="Naviguer vers la page de gestion des comptes"
              variant="outline"
            >
              Gérer vos comptes
            </Button>
          )}
        </ErrorWrapper>
      </div>
    );
  }
  return children;
};

export { ProfilesScreenWrapper };
