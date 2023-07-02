import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

const DOT_SIZES = {
  xs: 'h-0.5 w-0.5',
  sm: 'h-0.5 w-0.5',
  md: 'h-1 w-1',
  lg: 'h-1.5 w-1.5',
  xl: 'h-2 w-2',
  xxl: 'h-2.5 w-2.5',
};

const COLORS = {
  white: 'bg-white',
  primary: 'bg-primary-foreground',
};

interface DotsLoaderProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  color?: 'primary' | 'white';
}

const DotsLoader: FC<DotsLoaderProps> = ({
  className,
  size = 'md',
  color = 'white',
}) => {
  const sizeClassName = DOT_SIZES[size];
  const colorClassName = COLORS[color];

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <div
        className={cn(
          'animate-pulse direction-alternate duration-500 rounded-full',
          sizeClassName,
          colorClassName
        )}
      />
      <div
        className={cn(
          'animate-pulse direction-alternate duration-500 delay-150 rounded-full',
          sizeClassName,
          colorClassName
        )}
      />
      <div
        className={cn(
          'animate-pulse direction-alternate duration-500 delay-300 rounded-full',
          sizeClassName,
          colorClassName
        )}
      />
    </div>
  );
};

export { DotsLoader };
