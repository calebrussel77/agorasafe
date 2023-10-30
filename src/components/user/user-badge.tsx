import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getIsCustomer, getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { Badge, type BadgeProps } from '../ui/badge';

interface UserBadgeProps extends Omit<BadgeProps, 'content'> {
  type: ProfileType | null;
  withProfileBadgeInitial?: boolean;
}

const UserBadge: FC<UserBadgeProps> = ({
  type,
  withProfileBadgeInitial,
  className,
  ...props
}) => {
  if (!type) return null;

  return (
    <Badge
      variant={getIsCustomer(type) ? 'default' : 'primary'}
      content={
        withProfileBadgeInitial
          ? getProfileTypeName(type).charAt(0)
          : getProfileTypeName(type)
      }
      size="xs"
      className={cn(
        'line-clamp-1 flex-shrink-0 rounded-md text-xs font-semibold',
        className
      )}
      {...props}
    />
  );
};

export { UserBadge };
