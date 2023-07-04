import { useProfileStore } from '@/stores/profiles';
import { Icon, LogOut, MapPin, UserPlus2 } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { type FC, ReactElement, type ReactNode } from 'react';

import { Animate } from '@/components/ui/animate';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { GroupItem } from '@/components/ui/group-item';
import { SectionMessage } from '@/components/ui/section-message';
import { Skeleton } from '@/components/ui/skeleton';

import { type CurrentProfile } from '@/types/profiles';

import { generateArray } from '@/utils/misc';
import { getProfileType } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { type GetUserProfileConfigOutput } from '../types';

interface UserProfileDropdownProps {
  children: ReactNode;
  isLoading?: boolean;
  error?: { message: string };
  isOpen?: boolean;
  onToggle?: () => void;
  userProfileConfig: GetUserProfileConfigOutput;
  currentProfile: CurrentProfile;
}

const UserProfileDropdown: FC<UserProfileDropdownProps> = ({
  children,
  userProfileConfig,
  currentProfile,
  isLoading,
  isOpen,
  error,
  onToggle,
}) => {
  const { reset } = useProfileStore();

  if (!currentProfile) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenu.Trigger className="ml-4 hidden lg:flex rounded-full">
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[380px]">
        <Animate>
          {error ? (
            <SectionMessage
              title={error.message}
              appareance="danger"
              className="mb-24"
            />
          ) : (
            <>
              <DropdownMenu.Label>
                {isLoading ? (
                  <div className="flex items-center gap-2 px-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 w-full space-y-1.5">
                      <Skeleton className="w-1/2 h-4" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  </div>
                ) : (
                  <GroupItem
                    className="flex items-center hover:bg-transparent"
                    iconBefore={
                      <Avatar
                        bordered
                        src={currentProfile.avatar as string}
                        alt={currentProfile.name}
                      />
                    }
                    title={
                      <div className="flex items-center">
                        <h3 className="line-clamp-1 font-semibold">
                          {currentProfile.name}
                        </h3>
                        <Badge className="flex-shrink-0 ml-2 text-xs">
                          {getProfileType(currentProfile.type)}
                        </Badge>
                      </div>
                    }
                  >
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="h-4 w-4" />
                        {currentProfile.user.location?.name}
                      </p>
                    </div>
                  </GroupItem>
                )}
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              {isLoading ? (
                <div className="grid gap-3 my-6">
                  {generateArray(8).map(el => (
                    <div key={el} className="space-y-1.5 px-2">
                      <Skeleton className="w-1/2 h-4" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {userProfileConfig?.addProfileInfos?.canAddNewProfile && (
                    <>
                      <Link
                        href={userProfileConfig.addProfileInfos.href}
                        className="w-full"
                      >
                        <DropdownMenu.Item
                          className={cn(
                            buttonVariants({
                              size: 'sm',
                              variant: 'ghost',
                            }),
                            'w-full'
                          )}
                        >
                          <UserPlus2 className="h-5 w-5 mr-2" />
                          <span className="line-clamp-1">
                            {userProfileConfig.addProfileInfos.message}
                          </span>
                        </DropdownMenu.Item>
                      </Link>
                      <DropdownMenu.Separator />
                    </>
                  )}
                  {userProfileConfig?.switchProfileInfos
                    ?.canSwitchToOtherProfile && (
                    <>
                      <DropdownMenu.Item
                        onClick={reset}
                        className={cn(
                          buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                          }),
                          'w-full'
                        )}
                      >
                        <RefreshCcw className="h-5 w-5 mr-2" />
                        <span className="line-clamp-1">
                          {
                            userProfileConfig.switchProfileInfos
                              .switchProfileText
                          }
                        </span>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                    </>
                  )}
                  {userProfileConfig?.profileLinks?.map(link => (
                    <DropdownMenu.Item
                      key={link.id}
                      disabled={link.disabled}
                      className="flex flex-col justify-start text-left items-start"
                    >
                      <h3>{link.title}</h3>
                      <p className="text-muted-foreground mt-1">
                        {link.description}
                      </p>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => {
                      signOut()
                        .then(() => reset())
                        .catch(e => console.log(e));
                    }}
                    className="flex text-center items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenu.Item>
                </>
              )}
            </>
          )}
        </Animate>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export { UserProfileDropdown };
