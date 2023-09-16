import { LogOut, RefreshCcw } from 'lucide-react';
import { UserPlus2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { type FC } from 'react';

import { useAuth } from '@/features/auth';
import { useGetProfileConfig } from '@/features/profile-config';

import { useCurrentUser } from '@/hooks/use-current-user';

import { ActiveLink } from '../active-link';
import { LogoIcon } from '../icons/logo-icon';
import { AsyncWrapper } from '../ui/async-wrapper';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Typography } from '../ui/typography';
import { UserAvatar } from '../user-avatar';
import { UserBadge } from '../user-badge';

interface MobileNavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string }>;
}

const MobileNavbar: FC<MobileNavbarProps> = ({ navigations }) => {
  const { onSignOut } = useAuth();
  const { profile, resetProfile } = useCurrentUser();
  const {
    data: userProfileConfig,
    isFetching,
    error,
    refetch,
  } = useGetProfileConfig({ enabled: !!profile?.id });

  return (
    <>
      <div className="flex items-center justify-between p-6">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Agorasafe</span>
          <LogoIcon className="h-5 w-auto" />
        </a>
      </div>
      <div className="mt-2 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
          <div className="py-6">
            <AsyncWrapper
              isLoading={isFetching}
              error={error}
              onRetryError={() => void refetch()}
            >
              {profile ? (
                <>
                  <button className="-mx-3 flex w-full items-center gap-4 rounded-sm px-6 py-2 hover:bg-gray-100">
                    <UserAvatar
                      src={profile.avatar}
                      alt={profile.name}
                      type={profile.type}
                      className="h-10 w-10"
                    />
                    <div className="text-left">
                      <Typography
                        as="h3"
                        variant="h4"
                        className="font-semibold"
                        truncate
                      >
                        {profile.name}
                      </Typography>
                      <UserBadge
                        className="flex-shrink-0 text-xs"
                        type={profile.type}
                      />
                    </div>
                  </button>
                  <Separator />
                  {userProfileConfig?.canAddNewProfile && (
                    <>
                      <Link
                        href={userProfileConfig?.addNewProfileHref}
                        className="w-full px-2"
                      >
                        <Button className="w-full">
                          <UserPlus2 className="mr-2 h-5 w-5" />
                          <span className="line-clamp-1">
                            {userProfileConfig?.addNewProfileMessage}
                          </span>
                        </Button>
                      </Link>
                      <Separator />
                    </>
                  )}
                  {userProfileConfig?.canSwitchToOtherProfile && (
                    <>
                      <Button
                        onClick={resetProfile}
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
                          href={url}
                          activeClassName="bg-zinc-100 text-primary"
                          className="-mx-3 flex items-center px-3 py-2"
                        >
                          <Image
                            src={link.iconUrl}
                            alt={link.title}
                            width={20}
                            height={20}
                            className="mr-2 flex-shrink-0"
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
                    {navigations.map(item => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </section>
                  <Separator />
                  <section id="signout" className="my-3 px-6">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void onSignOut()}
                      className="ml-auto flex items-center justify-center text-center"
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
                  {navigations.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </section>
                <Separator />
                <Link href="/auth/login" className="mt-6 inline-block px-6">
                  <Button>Se connecter / Créer mon compte</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { MobileNavbar };
