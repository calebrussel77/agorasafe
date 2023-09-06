import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getIsCustomer, getProfileTypeName } from '@/utils/profile';

import { cn } from '@/lib/utils';

import { Badge, type BadgeProps } from '../ui/badge';

interface UserBadgeProps extends Omit<BadgeProps, 'content'> {
  type: ProfileType;
}

const UserBadge: FC<UserBadgeProps> = ({ type, className, ...props }) => {
  return (
    <Badge
      variant={getIsCustomer(type) ? 'default' : 'primary'}
      content={getProfileTypeName(type)}
      className={cn('flex-shrink-0 rounded-md text-xs', className)}
      {...props}
    />
  );
};

export { UserBadge };
