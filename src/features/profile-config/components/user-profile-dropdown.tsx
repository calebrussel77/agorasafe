import { useProfileStore } from '@/stores/profiles';
import { LogOut, MapPin, UserPlus2 } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

import { AutoAnimate } from '@/components/ui/auto-animate';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { GroupItem } from '@/components/ui/group-item';
import { SectionMessage } from '@/components/ui/section-message';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { type CurrentProfile } from '@/types/profiles';

import { generateArray } from '@/utils/misc';
import { getIsCustomer, getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { type GetProfileConfigOutput } from '../types';

interface UserProfileDropdownProps {
  children: ReactNode;
  isLoading?: boolean;
  error?: { message: string };
  isOpen?: boolean;
  onToggle?: () => void;
  userProfileConfig: GetProfileConfigOutput;
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
      <DropdownMenu.Trigger
        asChild
        className="ml-4 hidden rounded-full lg:flex"
      >
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={6} align="end" className="w-[380px]">
        <AutoAnimate>
          {error ? (
            <SectionMessage
              title={error.message}
              hasCloseButton={false}
              appareance="danger"
              className="mb-24"
            />
          ) : (
            <>
              <DropdownMenu.Label>
                {isLoading ? (
                  <div className="flex items-center gap-2 px-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="w-full flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : (
                  <GroupItem
                    className="flex items-center hover:bg-transparent"
                    iconBefore={
                      <UserAvatar
                        src={currentProfile.avatar as string}
                        alt={currentProfile.name}
                        type={currentProfile.type}
                      />
                    }
                    title={
                      <div className="flex items-center">
                        <Typography
                          as="h3"
                          variant="h4"
                          className="font-semibold"
                          truncate
                        >
                          {currentProfile.name}
                        </Typography>
                        <UserBadge
                          className="ml-2 flex-shrink-0 text-xs"
                          type={currentProfile.type}
                        />
                      </div>
                    }
                  >
                    <Typography
                      truncate
                      variant="small"
                      className="flex w-full items-center gap-1 text-muted-foreground"
                    >
                      <MapPin className="h-4 w-4" />
                      {currentProfile?.user?.location?.name}
                    </Typography>
                  </GroupItem>
                )}
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              {isLoading ? (
                <div className="my-6 grid gap-3">
                  {generateArray(8).map(el => (
                    <div key={el} className="space-y-1.5 px-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
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
                          <UserPlus2 className="mr-2 h-5 w-5" />
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
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        <Typography className="text-sm" truncate>
                          {
                            userProfileConfig.switchProfileInfos
                              .switchProfileText
                          }
                        </Typography>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                    </>
                  )}
                  {userProfileConfig?.profileLinks?.map(link => (
                    <DropdownMenu.Item
                      key={link.id}
                      disabled={link.disabled}
                      className="flex flex-col items-start justify-start text-left"
                    >
                      <Typography as="h3" variant="paragraph">
                        {link.title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-muted-foreground"
                      >
                        {link.description}
                      </Typography>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => {
                      signOut()
                        .then(() => reset())
                        .catch(e => console.log(e));
                    }}
                    className="flex items-center justify-center text-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenu.Item>
                </>
              )}
            </>
          )}
        </AutoAnimate>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export { UserProfileDropdown };
