import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

interface NavigationDotProps extends React.ComponentPropsWithoutRef<'button'> {
  className?: string;
  isActive?: boolean;
  direction?: 'left' | 'right';
}

const NavigationDot: FC<NavigationDotProps> = ({
  className,
  isActive,
  ...rest
}) => {
  return (
    <button
      className={cn(
        'h-2 w-2 rounded-full bg-gray-300 p-1 shadow-md',
        isActive &&
          'bg-brand-600 shadow-brand-600/80 ring-1 ring-brand-300 ring-offset-2',
        className
      )}
      {...rest}
    />
  );
};

export { NavigationDot };
