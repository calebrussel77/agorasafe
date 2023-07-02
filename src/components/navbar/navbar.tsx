import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import { MapPin, UserPlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { type FC, type ReactNode } from 'react';

import { FormSubscriptionModal } from '@/features/onboarding-souscription/components/form-subscription-modal';

import { getProfileType } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { LogoSymbolIcon } from '../icons/logo-icon';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button, buttonVariants } from '../ui/button';
import { DropdownMenu } from '../ui/dropdown-menu';
import { GroupItem } from '../ui/group-item';

interface NavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string }>;
  children?: ReactNode;
}

const getAddProfileInfos = (profileType: ProfileType) => {
  if (profileType === ProfileType.CUSTOMER) {
    return {
      message: `Ajouter un profile Prestataire`,
      href: `/add-new-profile?profile_type=${ProfileType.PROVIDER}`,
    };
  }
  return {
    message: `Ajouter un profile Client`,
    href: `/add-new-profile?profile_type=${ProfileType.CUSTOMER}`,
  };
};

const Navbar: FC<NavbarProps> = ({ className, children, navigations }) => {
  const { profile } = useProfileStore();

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
          <DropdownMenu>
            <DropdownMenu.Trigger className="ml-4 hidden lg:flex rounded-full">
              <Avatar
                src={profile.avatar as string}
                alt={profile.name}
                bordered
                className="h-10 w-10"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Label>
                <GroupItem
                  className="flex items-start hover:bg-transparent"
                  iconBefore={
                    <Avatar
                      bordered
                      src={profile.avatar as string}
                      alt={profile.name}
                    />
                  }
                  title={profile.name as never}
                >
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-1 line-clamp-1">
                      <MapPin className="h-4 w-4" />
                      {profile.user.location?.name}
                    </p>
                    <Badge className="mt-1">
                      {getProfileType(profile.type)}
                    </Badge>
                  </div>
                </GroupItem>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <Link
                href={getAddProfileInfos(profile.type).href}
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
                  <UserPlus className="h-5 w-5" />
                  {getAddProfileInfos(profile.type).message}
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Separator />
              <DropdownMenu.Item disabled>Dashboard</DropdownMenu.Item>
              <DropdownMenu.Item disabled>Profile</DropdownMenu.Item>
              <DropdownMenu.Item disabled>Settings</DropdownMenu.Item>
              <DropdownMenu.Item disabled>Changer de compte</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={() => void signOut()}>
                Se déconnecter
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
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
