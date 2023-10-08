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
        'h-3 w-3 rounded-full bg-gray-100 p-1 shadow-md',
        isActive &&
          'shadow-brand-600/ bg-brand-600 ring-1 ring-brand-300 ring-offset-2',
        className
      )}
      {...rest}
    />
  );
};

export { NavigationDot };
