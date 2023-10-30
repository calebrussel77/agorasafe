import { ChevronDown, LogOut, RefreshCcw, UserPlus2 } from 'lucide-react';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
import { AutoAnimate } from '@/components/ui/auto-animate';
import { Avatar } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { useAuth } from '@/features/auth';

import { generateArray } from '@/utils/misc';
import { isPathMatchRoute } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { type GetProfileConfigOutput } from '../types';

interface UserProfileDropdownProps {
  isLoading?: boolean;
  error?: { message: string };
  isOpen?: boolean;
  onToggle?: () => void;
  userProfileConfig: GetProfileConfigOutput;
  currentProfile: SimpleProfile;
  isHeaderScrolled: boolean;
}

const UserProfileDropdown: FC<UserProfileDropdownProps> = ({
  userProfileConfig,
  currentProfile,
  isLoading,
  isOpen,
  error,
  isHeaderScrolled,
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
        <button
          onClick={onToggle}
          className={cn(
            'default__transition flex items-center px-2 py-1',
            isHeaderScrolled ? 'hover:bg-brand-50' : 'hover:bg-gray-500'
          )}
        >
          <User
            profile={currentProfile}
            withRating={false}
            canLinkToProfile={false}
            subText={null}
          />
          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={15} align="end" className="w-[380px]">
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
            <div className="px-2 py-3">
              {isLoading ? (
                <div className="flex items-center gap-2 px-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="w-full flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ) : (
                <User
                  profile={currentProfile}
                  canLinkToProfile={false}
                  withProfileBadgeInitial={false}
                />
              )}
            </div>
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
                    <Anchor
                      // onClick={resetProfile}
                      href={userProfileConfig?.addNewProfileHref}
                      className="w-full"
                    >
                      <DropdownMenu.Item
                        className={cn(
                          buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                          }),
                          'h-auto w-full'
                        )}
                      >
                        <UserPlus2 className="mr-2 h-5 w-5" />
                        <span className="line-clamp-1">
                          {userProfileConfig?.addNewProfileMessage}
                        </span>
                      </DropdownMenu.Item>
                    </Anchor>
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
                      className={
                        isMatch ? 'mb-2 bg-zinc-100 text-primary' : 'mb-2'
                      }
                    >
                      <Anchor
                        href={url}
                        className="mt-1 flex w-full items-center justify-start gap-x-3 text-left"
                      >
                        <Avatar
                          src={link.iconUrl}
                          alt={link.title}
                          shape="square"
                          className="mr-2 h-5 w-5 flex-shrink-0"
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
                      </Anchor>
                    </DropdownMenu.Item>
                  );
                })}
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onClick={onSignOut}
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
