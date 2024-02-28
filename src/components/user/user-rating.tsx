import React, { type PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

import { ActionTooltip } from '../action-tooltip';
import { Inline } from '../ui/inline';
import { Rating, RatingProps } from '../ui/rating';

interface UserRatingProps extends RatingProps {
  className?: string;
  ratingCount?: number; //TODO - Makes it required on the future
  reviewsCount?: number; //TODO - Makes it required on the future
  profileName?: string;
  withReviews?: boolean;
}

const UserRating = ({
  className,
  reviewsCount = 1,
  ratingCount = 1,
  profileName,
  withReviews = false,
  ...rest
}: PropsWithChildren<UserRatingProps>) => {
  return (
    <Inline className={cn('flex items-baseline', className)}>
      {reviewsCount && withReviews && (
        <ActionTooltip
          label={`Nombre d'avis reçu ${
            profileName ? `de ${profileName}` : 'du profil'
          }`}
          asChild={false}
        >
          <span className="text-xs text-muted-foreground">
            {reviewsCount}0k
          </span>
        </ActionTooltip>
      )}
      <Rating readonly initialRating={ratingCount} size="xs" {...rest} />
    </Inline>
  );
};

export { UserRating };
