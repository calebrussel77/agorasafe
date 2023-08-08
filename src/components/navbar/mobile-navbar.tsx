import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import { LogOut, RefreshCcw } from 'lucide-react';
import { UserPlus2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { AskServiceModal } from '@/features/ask-services';
import { useGetProfileConfig } from '@/features/profile-config';

import { cn } from '@/lib/utils';

import { LogoIcon } from '../icons/logo-icon';
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
  const { profile, reset } = useProfileStore();

  const {
    data: userProfileConfig,
    isLoading,
    error,
  } = useGetProfileConfig({
    profileId: profile?.id as string,
  });

  const shouldDisplayCustomerButton =
    !profile || profile?.type === ProfileType.CUSTOMER;

  return (
    <>
      <div className="flex items-center justify-between">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Agorasafe</span>
          <LogoIcon className="h-4 w-auto md:h-5" />
        </a>
      </div>
      <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
          <div className="py-6">
            {profile ? (
              <>
                {' '}
                <button className="-mx-3 flex w-full items-center gap-2 rounded-sm px-3 py-2 hover:bg-gray-100">
                  <UserAvatar
                    src={profile.avatar as string}
                    alt={profile.name}
                    type={profile.type}
                    className="h-10 w-10"
                  />
                  <div className="text-left">
                    <h3 className="line-clamp-1 text-lg font-semibold">
                      {profile.name}
                    </h3>
                    <UserBadge type={profile.type} />
                  </div>
                </button>
                <Separator />
                {userProfileConfig?.addProfileInfos?.canAddNewProfile && (
                  <>
                    <Link
                      href={userProfileConfig.addProfileInfos.href}
                      className="w-full"
                    >
                      <Button className="w-full">
                        <UserPlus2 className="mr-2 h-5 w-5" />
                        <span className="line-clamp-1">
                          {userProfileConfig.addProfileInfos.message}
                        </span>
                      </Button>
                    </Link>
                    <Separator />
                  </>
                )}
                {userProfileConfig?.switchProfileInfos
                  ?.canSwitchToOtherProfile && (
                  <>
                    <Button
                      onClick={reset}
                      size="sm"
                      variant="ghost"
                      className="my-1 w-full"
                    >
                      <RefreshCcw className="mr-2 h-5 w-5" />
                      <Typography className="text-sm" truncate>
                        {userProfileConfig.switchProfileInfos.switchProfileText}
                      </Typography>
                    </Button>
                    <Separator />
                  </>
                )}
                <section id="user-connected-links" className="my-3 space-y-1">
                  {userProfileConfig?.profileLinks?.map(link => (
                    <button
                      key={link.id}
                      disabled={link.disabled}
                      className="-mx-3 flex w-full flex-col items-start justify-start px-3 py-2 text-left"
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
                    </button>
                  ))}
                </section>
                <Separator />
                <section
                  id="application-navigation-links"
                  className="my-3 space-y-1"
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
                <section id="signout" className="my-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      signOut()
                        .then(() => reset())
                        .catch(e => console.log(e));
                    }}
                    className="ml-auto flex items-center justify-center text-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </section>
              </>
            ) : null}
            {!profile && (
              <Link
                href="/auth/login"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { MobileNavbar };
