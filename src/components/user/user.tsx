import { ShieldCheck } from 'lucide-react';
import React, { type FC, type ReactNode } from 'react';

import { type SizeVariant } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Anchor } from '../anchor';
import { type AvatarProps } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Inline } from '../ui/inline';
import { Rating } from '../ui/rating';
import { Truncate } from '../ui/truncate';
import { Typography } from '../ui/typography';
import { UserAvatar } from './user-avatar';
import { UserName } from './user-name';

type ClassNames = {
  root: string;
  text: string;
  subText: string;
};

const mapAvatarTextSize: Record<
  SizeVariant,
  { textSize: string; subTextSize: string }
> = {
  xs: { textSize: 'text-xs', subTextSize: 'text-xs' },
  sm: { textSize: 'text-sm', subTextSize: 'text-xs' },
  md: { textSize: 'text-base', subTextSize: 'text-sm' },
  lg: { textSize: 'text-md', subTextSize: 'text-sm' },
  xl: { textSize: 'text-lg', subTextSize: 'text-sm' },
  xxl: { textSize: 'text-xl', subTextSize: 'text-base' },
};

interface UserProps {
  withProfileBadge?: boolean;

  withRating?: boolean;

  withUsername?: boolean;

  shouldIncludeAvatar?: boolean;

  canLinkToProfile?: boolean;

  size?: SizeVariant;

  profile: Partial<SimpleProfile> | null | undefined;

  withProfileBadgeInitial?: boolean;

  avatarProps?: AvatarProps;

  classNames?: Partial<ClassNames>;

  onClick?: () => void;

  subText?: React.ReactNode;

  withSubTextForce?: boolean;

  badge?: ReactNode;
}

const User: FC<UserProps> = ({
  profile,
  canLinkToProfile = true,
  shouldIncludeAvatar = true,
  withProfileBadgeInitial = true,
  withRating = true,
  withProfileBadge = true,
  withUsername = true,
  withSubTextForce = false,
  avatarProps,
  size = 'md',
  subText,
  badge,
  classNames,
  ...rest
}) => {
  // If no user return null
  if (!profile) return null;

  const textSizeClassNames =
    classNames?.text ?? mapAvatarTextSize[size].textSize;
  const subTextSizeClassNames =
    classNames?.subText ?? mapAvatarTextSize[size].subTextSize;

  subText = subText === null ? null : profile?.location?.name;
  const isProvider = profile?.type === 'PROVIDER';

  const user = (
    <div
      {...rest}
      className={cn('flex flex-nowrap items-center gap-x-3', classNames?.root)}
    >
      {shouldIncludeAvatar && (
        <UserProfileLink profile={profile} canLinkToProfile={canLinkToProfile}>
          <UserAvatar profile={profile} shape="circle" {...avatarProps} />
        </UserProfileLink>
      )}
      {withUsername || subText || (isProvider && withRating) ? (
        <div className="flex w-full flex-col items-start">
          {withUsername && (
            <UserProfileLink
              profile={profile}
              canLinkToProfile={canLinkToProfile}
            >
              <Inline>
                <UserName
                  withProfileBadge={withProfileBadge}
                  withProfileBadgeInitial={withProfileBadgeInitial}
                  profile={profile}
                  className={cn(textSizeClassNames, classNames?.text)}
                />
                {badge}
              </Inline>
            </UserProfileLink>
          )}

          {subText && (typeof subText === 'string' || withSubTextForce) ? (
            <Typography
              truncate
              className={cn(
                '-mt-0.5 text-muted-foreground',
                subTextSizeClassNames,
                classNames?.subText
              )}
            >
              {subText}
            </Typography>
          ) : (
            subText
          )}

          {isProvider && withRating && (
            <Rating readonly initialRating={1} size="xs" className="-mt-1" />
          )}
        </div>
      ) : null}
    </div>
  );

  return user;
};

const UserProfileLink = ({
  children,
  profile,
  canLinkToProfile,
}: {
  children: JSX.Element;
  profile?: UserProps['profile'];
  canLinkToProfile?: boolean;
}) => {
  if (!profile || !canLinkToProfile || !!profile.deletedAt)
    return <>{children}</>;

  const href = `/u/${profile.slug}`;

  return (
    <Anchor
      href={href}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
    >
      {children}
    </Anchor>
  );
};

export { User };
