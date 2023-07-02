import { useProfileStore } from '@/stores/profiles';
import Link from 'next/link';
import React, { type FC } from 'react';

import { getProfileType } from '@/utils/profile';

import { LogoIcon } from '../icons/logo-icon';
import { Avatar } from '../ui/avatar';

interface MobileNavbarProps {
  className?: string;
  navigations: Array<{ name: string; href: string }>;
}

const MobileNavbar: FC<MobileNavbarProps> = ({ navigations }) => {
  const { profile } = useProfileStore();

  return (
    <>
      <div className="flex items-center justify-between">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <LogoIcon className="h-4 md:h-5 w-auto" />
        </a>
      </div>
      <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-gray-500/10">
          <div className="space-y-2 py-6">
            {navigations.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="py-6">
            {profile ? (
              <button className="-mx-3 w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-gray-100">
                <Avatar
                  src={profile.avatar as string}
                  alt={profile.name}
                  bordered
                  className="h-10 w-10"
                />
                <div className="text-left">
                  <h3 className="line-clamp-1 text-lg font-semibold">
                    {profile.name}
                  </h3>
                  <p className="line-clamp-1">{getProfileType(profile.type)}</p>
                </div>
              </button>
            ) : (
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
