/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { type FC } from 'react';
import StarRating, { type RatingComponentProps } from 'react-rating';

import { StarSolidIcon } from '@/components/icons/star-solid-icon';

import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  xxl: 'h-12 w-12',
};

type ClassNames = {
  root: string;
  icon: string;
  emptyIcon: string;
  fillIcon: string;
};

interface RatingProps extends Omit<RatingComponentProps, 'size'> {
  className?: string;
  size?: keyof typeof sizeClasses;
  classNames?: ClassNames;
}

const Rating: FC<RatingProps> = ({
  className,
  size = 'md',
  classNames,
  ...props
}) => {
  return (
    // @ts-ignore
    <StarRating
      className={cn(classNames?.root, className)}
      emptySymbol={
        <StarSolidIcon
          className={cn(
            'text-gray-500',
            sizeClasses[size],
            classNames?.icon,
            classNames?.emptyIcon
          )}
        />
      }
      fullSymbol={
        <StarSolidIcon
          className={cn(
            'text-yellow-500',
            sizeClasses[size],
            classNames?.icon,
            classNames?.fillIcon
          )}
        />
      }
      {...props}
    />
  );
};

export { Rating };
