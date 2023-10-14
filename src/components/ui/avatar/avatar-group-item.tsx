import React, { type FC, type MouseEventHandler } from 'react';

import { Anchor } from '@/components/anchor';

import { Avatar, type AvatarProps } from './avatar';

export interface AvatarGroupItemProps {
  avatar: AvatarProps & { name?: string; href?: string };
  index: number;
  onAvatarClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AvatarGroupItem: FC<AvatarGroupItemProps> = ({
  avatar,
  onAvatarClick,
  ...props
}) => {
  const { href, onClick, ...rest } = avatar;

  const AvatarIcon = <Avatar {...rest} />;

  // onClick handler provided with avatar data takes precedence, same as with the normal avatar item
  const callback = onClick || onAvatarClick;

  if (href) {
    return (
      <Anchor
        href={href}
        onClick={callback as MouseEventHandler<HTMLAnchorElement> | undefined}
        className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-gray-100"
        {...props}
      >
        <>
          {AvatarIcon}
          <span>{avatar.name}</span>
        </>
      </Anchor>
    );
  }

  return (
    <div
      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-gray-100"
      {...props}
    >
      {AvatarIcon}
      <span>{avatar.name}</span>
    </div>
  );
};

export { AvatarGroupItem };
