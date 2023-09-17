import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getIsCustomer, getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { Badge, type BadgeProps } from '../ui/badge';

interface UserBadgeProps extends Omit<BadgeProps, 'content'> {
  type: ProfileType;
  withProfileTypeInitial?: boolean;
}

const UserBadge: FC<UserBadgeProps> = ({
  type,
  withProfileTypeInitial,
  className,
  ...props
}) => {
  return (
    <Badge
      variant={getIsCustomer(type) ? 'default' : 'primary'}
      content={
        withProfileTypeInitial
          ? getProfileTypeName(type).charAt(0)
          : getProfileTypeName(type)
      }
      className={cn('flex-shrink-0 rounded-md text-xs', className)}
      {...props}
    />
  );
};

export { UserBadge };
