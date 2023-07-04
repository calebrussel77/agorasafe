import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import Link from 'next/link';
import React, { type FC, type ReactNode, useCallback, useState } from 'react';

import { FormSubscriptionModal } from '@/features/onboarding-souscription/components/form-subscription-modal';
import {
  UserProfileDropdown,
  useGetUserProfileConfig,
} from '@/features/user-profile-config';

import { cn } from '@/lib/utils';

import { LogoSymbolIcon } from '../icons/logo-icon';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

interface NavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string }>;
  children?: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ className, children, navigations }) => {
  const { profile } = useProfileStore();
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);

  const { data, isFetching, error } = useGetUserProfileConfig(
    { profileId: profile?.id as string },
    { enabled: isOpenDropDown && !!profile, staleTime: 1000 * 60 * 10 }
  );

  const onToggle = useCallback(() => {
    setIsOpenDropDown(!isOpenDropDown);
  }, [isOpenDropDown]);

  return (
    <nav
      className={cn(
        'flex items-center justify-between py-3 px-4 lg:px-8',
        className
      )}
      aria-label="Global"
    >
      <div className="flex xl:flex-1 items-center gap-3">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <LogoSymbolIcon className="h-7 md:h-8 w-auto" />
        </Link>
      </div>
      <div className="hidden lg:flex lg:gap-x-12 ml-4 lg:items-center">
        {navigations.map(item => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-semibold leading-6 text-white"
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="flex items-center lg:flex-1 lg:justify-end">
        {(!profile || profile?.type === ProfileType.CUSTOMER) && (
          <FormSubscriptionModal>
            <Button size="sm">Demander un service</Button>
          </FormSubscriptionModal>
        )}
        {profile ? (
          <UserProfileDropdown
            isOpen={isOpenDropDown}
            onToggle={onToggle}
            currentProfile={profile}
            userProfileConfig={data as never}
            error={error as never}
            isLoading={isFetching}
          >
            <Avatar
              onClick={onToggle}
              src={profile.avatar as string}
              alt={profile.name}
              bordered
              className="h-10 w-10"
            />
          </UserProfileDropdown>
        ) : (
          <Link
            href="/auth/login"
            className="ml-4 hidden lg:flex text-sm font-semibold leading-6 text-white"
          >
            Se connecter <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>
      <div className="flex lg:hidden">{children}</div>
    </nav>
  );
};

export { Navbar };
