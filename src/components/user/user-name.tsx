import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { ActionTooltip } from '../action-tooltip';
import { LogoSymbolIcon } from '../icons/logo-icon';
import { Typography } from '../ui/typography';
import { UserBadge } from './user-badge';

type ClassNames = {
  root: string;
  text: string;
  badge: string;
};

interface UserAvatarProps {
  className?: string;
  classNames?: Partial<ClassNames>;
  onClick?: () => void;
  profile: Partial<SimpleProfile> | null | undefined;
  withProfileBadge?: boolean;
  withProfileBadgeInitial?: boolean;
}

const UserName: FC<UserAvatarProps> = ({
  profile,
  withProfileBadge = true,
  className,
  classNames,
  withProfileBadgeInitial,
  ...props
}) => {
  if (!profile) return null;

  const isAdmin = profile?.user?.role === 'ADMIN';
  const isDeleted = !!profile.deletedAt;

  if (isDeleted)
    return (
      <Typography
        as="h3"
        variant="h4"
        truncate
        className={cn(
          'line-clamp-1 text-base font-semibold',
          className,
          classNames?.text
        )}
      >
        [Supprimé]
      </Typography>
    );

  return (
    <div
      className={cn(
        'flex flex-nowrap items-center gap-x-1 leading-none tracking-tight',
        classNames?.root
      )}
    >
      <Typography
        as="h3"
        truncate
        variant="h4"
        className={cn(
          'line-clamp-1 text-base font-semibold',
          className,
          classNames?.text
        )}
      >
        {profile?.name}
      </Typography>
      {withProfileBadge && (
        <ActionTooltip
          label={getProfileTypeName(profile.type as ProfileType)}
          asChild={false}
        >
          <UserBadge
            size="xs"
            type={profile.type as ProfileType}
            withProfileBadgeInitial={withProfileBadgeInitial}
            className={cn(classNames?.badge)}
            {...props}
          />
        </ActionTooltip>
      )}
      {isAdmin && (
        <ActionTooltip label="Agorasafe Modérateur" asChild={false}>
          <LogoSymbolIcon
            className={cn('h-4 w-4 flex-shrink-0', classNames?.badge)}
          />
        </ActionTooltip>
      )}
    </div>
  );
};

export { UserName };
