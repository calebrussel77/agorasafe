import { LogOut, MapPin, UserPlus2 } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { type FC } from 'react';

import { AutoAnimate } from '@/components/ui/auto-animate';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { GroupItem } from '@/components/ui/group-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { useAuth } from '@/features/auth';
import { type CurrentProfile } from '@/features/profiles';

import { generateArray, isPathMatchRoute } from '@/utils/misc';

import { cn } from '@/lib/utils';

import { useCurrentUser } from '@/hooks/use-current-user';

import { type GetProfileConfigOutput } from '../types';

interface UserProfileDropdownProps {
  isLoading?: boolean;
  error?: { message: string };
  isOpen?: boolean;
  onToggle?: () => void;
  userProfileConfig: GetProfileConfigOutput;
  currentProfile: CurrentProfile;
}

const UserProfileDropdown: FC<UserProfileDropdownProps> = ({
  userProfileConfig,
  currentProfile,
  isLoading,
  isOpen,
  error,
  onToggle,
}) => {
  const { onSignOut } = useAuth();
  const { resetProfile } = useCurrentUser();

  if (!currentProfile) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenu.Trigger
        asChild
        className="ml-4 hidden rounded-full lg:flex"
      >
        <button className="flex items-center gap-3">
          <UserAvatar
            onClick={onToggle}
            src={(currentProfile.avatar as string) || '/sed'}
            alt={currentProfile.name}
            type={currentProfile.type}
            className="h-8 w-8"
          />
          <Typography className="text-white" truncate lines={1}>
            {currentProfile.name}
          </Typography>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={6} align="end" className="w-[380px]">
        <AutoAnimate>
          <ErrorWrapper
            error={error}
            errorComponent={
              <SectionError
                hasActions={false}
                classNames={{ icon: 'h-32 w-auto' }}
                error={error}
              />
            }
          >
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
                  iconBefore={
                    <UserAvatar
                      src={currentProfile.avatar as string}
                      alt={currentProfile.name}
                      type={currentProfile.type}
                    />
                  }
                  name={
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
                  description={
                    <Typography
                      truncate
                      variant="small"
                      className="flex w-full items-center gap-1 text-muted-foreground"
                    >
                      <MapPin className="h-4 w-4" />
                      {currentProfile?.user?.location?.name}
                    </Typography>
                  }
                  classNames={{
                    root: 'flex items-center hover:bg-transparent',
                  }}
                />
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
                {userProfileConfig?.canAddNewProfile && (
                  <>
                    <Link
                      href={userProfileConfig?.addNewProfileHref}
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
                          {userProfileConfig?.addNewProfileMessage}
                        </span>
                      </DropdownMenu.Item>
                    </Link>
                    <DropdownMenu.Separator />
                  </>
                )}

                {userProfileConfig?.canSwitchToOtherProfile && (
                  <>
                    <DropdownMenu.Item asChild>
                      <Button
                        onClick={resetProfile}
                        size="sm"
                        variant="ghost"
                        className="flex w-full"
                      >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        <Typography className="text-sm" truncate>
                          {userProfileConfig.switchProfileMessage}
                        </Typography>
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                  </>
                )}

                {userProfileConfig?.appProfileLinks?.map(link => {
                  const isProfileLink = link.id === 5;
                  const url = isProfileLink
                    ? `/u/${currentProfile.slug}`
                    : link.href;
                  const isMatch = isPathMatchRoute(url);

                  return (
                    <DropdownMenu.Item
                      key={link.id}
                      disabled={link.disabled}
                      className={isMatch ? 'bg-zinc-100 text-primary' : ''}
                    >
                      <Link
                        href={url}
                        className="mt-1 flex w-full items-center justify-start gap-x-1 text-left"
                      >
                        <Image
                          src={link.iconUrl}
                          alt={link.title}
                          width={20}
                          height={20}
                          className="mr-2 flex-shrink-0"
                        />
                        <div className="flex flex-col items-start justify-start">
                          <Typography as="h3" variant="paragraph">
                            {link.title}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-muted-foreground"
                          >
                            {link.description}
                          </Typography>
                        </div>
                      </Link>
                    </DropdownMenu.Item>
                  );
                })}
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onClick={() => void onSignOut(resetProfile)}
                  className="flex items-center justify-center text-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenu.Item>
              </>
            )}
          </ErrorWrapper>
        </AutoAnimate>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export { UserProfileDropdown };
