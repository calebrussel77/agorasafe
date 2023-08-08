import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getIsCustomer, getProfileTypeName } from '@/utils/profile';

import { Badge, type BadgeProps } from '../ui/badge';

interface UserBadgeProps extends Omit<BadgeProps, 'content'> {
  type: ProfileType;
}

const UserBadge: FC<UserBadgeProps> = ({ type, ...props }) => {
  return (
    <Badge
      variant={getIsCustomer(type) ? 'default' : 'primary'}
      content={getProfileTypeName(type)}
      {...props}
    />
  );
};

export { UserBadge };
