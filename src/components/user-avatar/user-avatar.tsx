import { type ProfileType } from '@prisma/client';
import { type FC } from 'react';

import { getIsCustomer } from '@/utils/profile';

import { Avatar, type AvatarProps } from '../ui/avatar';

interface UserAvatarProps extends AvatarProps {
  type: ProfileType;
}

const UserAvatar: FC<UserAvatarProps> = ({ type, ...props }) => {
  return (
    <Avatar
      isBordered
      color={getIsCustomer(type) ? 'default' : 'primary'}
      {...props}
    />
  );
};

export { UserAvatar };
