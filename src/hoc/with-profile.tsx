import { useProfileStore } from '@/stores/profiles';
import { type Profile } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useMountedState } from 'react-use';

import { Animate } from '@/components/ui/animate';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorWrapper } from '@/components/ui/error';
import { Notification } from '@/components/ui/notification';
import { Skeleton } from '@/components/ui/skeleton';
import { FullSpinner } from '@/components/ui/spinner';

import {
  type GetUserProfilesOutput,
  ProfileItemSkeleton,
  useUserProfiles,
} from '@/features/profiles';

import { generateArray } from '@/utils/misc';
import { getProfileType } from '@/utils/profile';

// Define a type for the component props
type ComponentProps = {
  profile: GetUserProfilesOutput['profiles'][0] | null;
} & unknown;

// Define a higher-order component for profile check
const withProfile = (WrappedComponent: React.ComponentType<ComponentProps>) => {
  const WrapperComponent: React.FC<ComponentProps> = props => {
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
          <p className="text-muted-foreground max-w-md w-full text-center">
            {data?.message}
          </p>
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
                        toast(
                          <Notification
                            variant="success"
                            title={
                              <p className="font-normal">
                                Vous interagissez maintenant en tant que:{' '}
                                <span className="font-semibold">
                                  {profile.name}
                                </span>
                              </p>
                            }
                          />,
                          {
                            autoClose: false,
                          }
                        );
                      }}
                      className="flex flex-col items-center p-3 rounded-md group hover:bg-gray-100"
                    >
                      <Avatar
                        src={profile.avatar as string}
                        alt={profile.name}
                        bordered
                        className="shadow-md aspect-square h-20 w-20 sm:h-24 sm:w-24"
                      />
                      <h3 className="mt-3 line-clamp-1 text-lg font-semibold">
                        {profile.name}
                      </h3>
                      <Badge className="line-clamp-1">
                        {getProfileType(profile.type)}
                      </Badge>
                    </button>
                  ))}
            </Animate>
            {isFetching ? (
              <Skeleton className="h-10 aspect-square w-40 " />
            ) : (
              <Button
                aria-label="Naviguer vers la page de gestion des comptes"
                variant="outline"
              >
                Gérer vos profiles
              </Button>
            )}
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
