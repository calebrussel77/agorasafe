import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { ActionTooltip } from '../action-tooltip';
import { LogoSymbolIcon } from '../icons/logo-icon';
import { Tooltip } from '../ui/tooltip';
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
  withProfileBadgeInitial = true,
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
          'line-clamp-1 text-sm font-semibold',
          className,
          classNames?.text
        )}
      >
        [Supprimé]
      </Typography>
    );

  return (
    <div
      className={cn('flex flex-nowrap items-center gap-x-1', classNames?.root)}
    >
      <Typography
        as="h3"
        truncate
        variant="h4"
        className={cn(
          'line-clamp-1 text-sm font-semibold',
          className,
          classNames?.text
        )}
      >
        {profile?.name}
      </Typography>

      {/* //TODO: Need to fix hydratation error occuring when using a tooltip */}
      {withProfileBadge && (
        <UserBadge
          size="xs"
          type={profile.type as ProfileType}
          withProfileBadgeInitial={withProfileBadgeInitial}
          className={cn(classNames?.badge)}
        />
      )}

      {/* //TODO: Need to fix hydratation error occuring when using a tooltip */}
      {isAdmin && (
        <LogoSymbolIcon
          className={cn('h-4 w-4 flex-shrink-0', classNames?.badge)}
        />
      )}
    </div>
  );
};

export { UserName };
