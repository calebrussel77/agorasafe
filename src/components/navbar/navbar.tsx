import React, { type FC, type ReactNode } from 'react';

import { FeedbackButton } from '@/features/feedbacks';
import {
  UserProfileDropdown,
  useGetProfileConfig,
} from '@/features/profile-config';
import { ServiceRequestButton } from '@/features/service-requests';

import { cn } from '@/lib/utils';

import { useIsMobile } from '@/hooks/use-breakpoints';
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
  navigations: Array<{ name: string; href: string; isNew: boolean }>;
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
      className={cn('flex items-center gap-x-4 px-4 py-3.5 lg:px-8', className)}
      aria-label="Global"
    >
      <div className="flex items-center gap-3">
        <span className="sr-only">Your Company</span>
        <Anchor href="/" className="-m-1.5 flex items-start gap-x-1.5 p-1.5">
          <LogoSymbolIcon className="h-7 w-auto md:h-8" />
          <Badge
            content="Alpha"
            size="sm"
            variant="warning"
            shape="rounded"
            title="Ce projet est encore en cours de developpement."
          />
        </Anchor>
      </div>
      <div className="hidden gap-x-6 lg:flex lg:items-center xl:gap-x-10">
        {navigations.map(item => {
          if (item.name.toLowerCase() === 'feedback') {
            return (
              <FeedbackButton key={item?.name}>
                <button>
                  <Badge
                    content="New"
                    variant="success"
                    size="xs"
                    placement="top-right"
                  >
                    {item.name}
                  </Badge>
                </button>
              </FeedbackButton>
            );
          }

          return (
            <Anchor
              key={item.name}
              href={item.href}
              className={cn(
                'default__transition font- rounded-md px-2 py-1 text-sm',
                'flex items-center hover:bg-brand-50 hover:text-brand-600'
              )}
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
      </div>
      <div className="ml-1 flex flex-1 items-center justify-end">
        <ServiceRequestButton>
          <Button size="sm">Demander un service</Button>
        </ServiceRequestButton>
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
            Connexion
          </Anchor>
        )}
      </div>
      <div className="flex lg:hidden">{children}</div>
    </nav>
  );
};

export { Navbar };
