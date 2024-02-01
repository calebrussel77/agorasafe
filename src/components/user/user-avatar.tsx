import { type FC } from 'react';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { Avatar, type AvatarProps } from '../ui/avatar';

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
  profile: Partial<SimpleProfile> | null | undefined;
}

const UserAvatar: FC<UserAvatarProps> = ({ profile, ...props }) => {
  if (!profile) return null;

  const isProfileDeleted = !!profile.deletedAt;

  return (
    <Avatar
      isBordered
      style={{ backgroundColor: 'rgba(0,0,0,0.31)' }}
      src={profile.avatar && !isProfileDeleted ? profile.avatar : undefined}
      alt={
        profile.name && !isProfileDeleted
          ? `${profile.name}'s Avatar`
          : undefined
      }
      {...props}
    />
  );
};

export { UserAvatar };
