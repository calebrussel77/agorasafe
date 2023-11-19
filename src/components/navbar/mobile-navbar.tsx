import { LogOut, RefreshCcw } from 'lucide-react';
import { UserPlus2 } from 'lucide-react';
import React, { type FC } from 'react';

import { useAuth } from '@/features/auth';
import { FeedbackButton } from '@/features/feedbacks';
import { useGetProfileConfig } from '@/features/profile-config';

import { useCurrentUser } from '@/hooks/use-current-user';

import { ActiveLink } from '../active-link';
import { Anchor } from '../anchor';
import { LogoIcon } from '../icons/logo-icon';
import { AsyncWrapper } from '../ui/async-wrapper';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { openContextModal } from '../ui/modal/events';
import { Separator } from '../ui/separator';
import { Typography } from '../ui/typography';
import { User } from '../user';

interface MobileNavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string; isNew: boolean }>;
  closeSideBar: () => void;
}

const MobileNavbar: FC<MobileNavbarProps> = ({ navigations, closeSideBar }) => {
  const { onSignOut } = useAuth();
  const { profile, resetProfile } = useCurrentUser();

  const {
    data: userProfileConfig,
    isInitialLoading,
    error,
    refetch,
  } = useGetProfileConfig({ enabled: !!profile?.id });

  return (
    <>
      <div className="flex items-center justify-between p-6">
        <Anchor href="#" className="-m-1.5 flex items-center gap-x-1 p-1.5">
          <span className="sr-only">Agorasafe</span>
          <LogoIcon className="h-5 w-auto" />
          <Badge content="Alpha" size="xs" variant="warning" />
        </Anchor>
      </div>
      <div className="mt-2 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
          <div className="py-6">
            <AsyncWrapper
              isLoading={isInitialLoading}
              error={error}
              onRetryError={() => void refetch()}
            >
              {profile ? (
                <>
                  <User profile={profile} classNames={{ root: 'mx-3 py-3' }} />
                  <Separator />
                  {userProfileConfig?.canAddNewProfile && (
                    <>
                      <Button
                        onClick={() => {
                          openContextModal({
                            modal: 'addProfile',
                            isFullScreen: true,
                            innerProps: {
                              choosedProfileType:
                                userProfileConfig?.allowedProfileType,
                            },
                          });
                          closeSideBar();
                        }}
                        size="sm"
                        className="my-1 w-full px-2"
                        variant="ghost"
                      >
                        <UserPlus2 className="mr-2 h-5 w-5" />
                        <span className="line-clamp-1">
                          {userProfileConfig?.addNewProfileMessage}
                        </span>
                      </Button>

                      <Separator />
                    </>
                  )}
                  {userProfileConfig?.canSwitchToOtherProfile && (
                    <>
                      <Button
                        onClick={() => {
                          resetProfile();
                          closeSideBar();
                        }}
                        size="sm"
                        variant="ghost"
                        className="my-1 w-full px-6"
                      >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        <Typography className="text-sm" truncate>
                          {userProfileConfig?.switchProfileMessage}
                        </Typography>
                      </Button>
                      <Separator />
                    </>
                  )}
                  <section
                    id="user-connected-links"
                    className="my-3 space-y-1 px-6"
                  >
                    {userProfileConfig?.appProfileLinks?.map(link => {
                      const isProfileLink = link.id === 5;
                      const url = isProfileLink
                        ? `/u/${profile?.slug}`
                        : link.href;

                      return (
                        <ActiveLink
                          key={link.id}
                          onClick={closeSideBar}
                          href={url}
                          activeClassName="bg-zinc-100 text-primary"
                          className="-mx-3 flex items-center gap-x-3 px-3 py-2"
                        >
                          <Avatar
                            src={link.iconUrl}
                            alt={link.title}
                            shape="square"
                            className="mr-2 h-5 w-5 flex-shrink-0"
                          />
                          <div className="flex w-full flex-col items-start justify-start text-left">
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
                        </ActiveLink>
                      );
                    })}
                  </section>
                  <Separator />
                  <section
                    id="application-navigation-links"
                    className="my-3 space-y-1 px-6"
                  >
                    {navigations.map(item => {
                      if (item.name.toLowerCase() === 'feedback') {
                        return (
                          <FeedbackButton
                            onHandleClick={closeSideBar}
                            key={item?.name}
                          >
                            <button className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                              {item.name}
                              {item?.isNew && (
                                <Badge
                                  content="New"
                                  size="xs"
                                  className="ml-0.5"
                                  variant="success"
                                />
                              )}
                            </button>
                          </FeedbackButton>
                        );
                      }
                      return (
                        <Anchor
                          onClick={closeSideBar}
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </Anchor>
                      );
                    })}
                  </section>
                  <Separator />
                  <section id="signout" className="my-3 px-6">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onSignOut}
                      className="flex w-full items-center justify-center text-center"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </section>
                </>
              ) : null}
            </AsyncWrapper>

            {!profile && (
              <>
                <Separator />
                <section
                  id="application-navigation-links"
                  className="my-3 space-y-1 px-6"
                >
                  {navigations.map(item => {
                    if (item.name.toLowerCase() === 'feedback') {
                      return (
                        <FeedbackButton key={item?.name}>
                          <button className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                            {item.name}
                            {item?.isNew && (
                              <Badge
                                content="New"
                                size="xs"
                                className="ml-0.5"
                                variant="success"
                              />
                            )}
                          </button>
                        </FeedbackButton>
                      );
                    }

                    return (
                      <Anchor
                        key={item.name}
                        href={item.href}
                        className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                        {item?.isNew && (
                          <Badge
                            content="New"
                            size="xs"
                            className="ml-0.5"
                            variant="success"
                          />
                        )}
                      </Anchor>
                    );
                  })}
                </section>
                <Separator />
                <div className="mt-6 px-4">
                  <Button href="/auth/login" className="w-full">
                    Se connecter
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { MobileNavbar };
