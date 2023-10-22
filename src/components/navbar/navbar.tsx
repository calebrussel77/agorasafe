import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

import { LoginRedirect } from '@/features/auth';
import {
  UserProfileDropdown,
  useGetProfileConfig,
} from '@/features/profile-config';
import { AskServiceModal } from '@/features/services';

import { cn } from '@/lib/utils';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Anchor } from '../anchor';
import { CanView } from '../can-view';
import { LogoSymbolIcon } from '../icons/logo-icon';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useDropdownMenu } from '../ui/dropdown-menu';

interface NavbarProps {
  className?: string;
  isHeaderScrolled: boolean;
  navigations: Array<{ name: string; href: string }>;
  children?: ReactNode;
}

const Navbar: FC<NavbarProps> = ({
  isHeaderScrolled,
  className,
  children,
  navigations,
}) => {
  const { profile, status } = useCurrentUser();
  const { isDropdownMenuOpen, onToggleDropdownMenu } = useDropdownMenu();

  const { data, isInitialLoading, error } = useGetProfileConfig({
    enabled: isDropdownMenuOpen,
  });

  return (
    <nav
      className={cn(
        'flex items-center justify-between px-4 py-3.5 lg:px-8',
        className
      )}
      aria-label="Global"
    >
      <div className="flex items-center gap-3 xl:flex-1">
        <span className="sr-only">Your Company</span>
        <Anchor href="/" className="-m-1.5 flex items-start gap-x-1.5 p-1.5">
          <LogoSymbolIcon className="h-7 w-auto md:h-8" />
          <Badge
            content="Alpha"
            size="sm"
            variant="danger"
            shape="rounded"
            title="Ce projet est encore en cours de developpement."
          />
        </Anchor>
      </div>
      <div className="ml-4 hidden lg:flex lg:items-center lg:gap-x-12">
        {navigations.map(item => (
          <Anchor
            key={item.name}
            href={item.href}
            className={cn(
              'default__transition rounded-md px-2 py-1 text-sm font-semibold leading-6',
              isHeaderScrolled
                ? 'hover:bg-brand-50 hover:text-brand-600'
                : 'hover:bg-gray-500'
            )}
          >
            {item.name}
          </Anchor>
        ))}
      </div>
      <div className="flex items-center lg:flex-1 lg:justify-end">
        <CanView allowedProfiles={['CUSTOMER']} isPublic>
          <AskServiceModal>
            <LoginRedirect reason="create-service-request">
              <Button size="sm">Demander un service</Button>
            </LoginRedirect>
          </AskServiceModal>
        </CanView>
        <CanView allowedProfiles={['CUSTOMER', 'PROVIDER']}>
          <UserProfileDropdown
            isHeaderScrolled={isHeaderScrolled}
            isOpen={isDropdownMenuOpen}
            onToggle={onToggleDropdownMenu}
            currentProfile={profile as never}
            userProfileConfig={data as never}
            error={error as never}
            isLoading={isInitialLoading}
          />
        </CanView>
        {status === 'unauthenticated' && !profile && (
          <Anchor
            href="/auth/login"
            className="ml-4 hidden text-sm font-semibold leading-6 lg:flex"
          >
            <>
              Se connecter <span aria-hidden="true">&rarr;</span>
            </>
          </Anchor>
        )}
      </div>
      <div className="flex lg:hidden">{children}</div>
    </nav>
  );
};

export { Navbar };
