import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

import { AskServiceModal } from '@/features/ask-services';
import {
  UserProfileDropdown,
  useGetProfileConfig,
} from '@/features/profile-config';

import { cn } from '@/lib/utils';

import { LogoSymbolIcon } from '../icons/logo-icon';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { useDropdownMenu } from '../ui/dropdown-menu';

interface NavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string }>;
  children?: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ className, children, navigations }) => {
  const { profile } = useProfileStore();
  const { isDropdownMenuOpen, onToggleDropdownMenu } = useDropdownMenu();

  const { data, isLoading, error } = useGetProfileConfig(
    { profile_id: profile?.id as string },
    { enabled: isDropdownMenuOpen }
  );

  const shouldDisplayCustomerButton =
    !profile || profile?.type === ProfileType.CUSTOMER;

  return (
    <nav
      className={cn(
        'flex items-center justify-between px-4 py-3 lg:px-8',
        className
      )}
      aria-label="Global"
    >
      <div className="flex items-center gap-3 xl:flex-1">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <LogoSymbolIcon className="h-7 w-auto md:h-8" />
        </Link>
      </div>
      <div className="ml-4 hidden lg:flex lg:items-center lg:gap-x-12">
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
        {shouldDisplayCustomerButton && (
          <AskServiceModal>
            <Button size="sm">Demander un service</Button>
          </AskServiceModal>
        )}
        {profile ? (
          <UserProfileDropdown
            isOpen={isDropdownMenuOpen}
            onToggle={onToggleDropdownMenu}
            currentProfile={profile}
            userProfileConfig={data as never}
            error={error as never}
            isLoading={isLoading}
          >
            <Avatar
              onClick={onToggleDropdownMenu}
              src={profile.avatar as string}
              alt={profile.name}
              bordered
              className="h-10 w-10"
            />
          </UserProfileDropdown>
        ) : (
          <Link
            href="/auth/login"
            className="ml-4 hidden text-sm font-semibold leading-6 text-white lg:flex"
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
