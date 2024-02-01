import React, { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface FixedFooterContainerProps {
  className?: string;
  children: ReactNode;
}

const FixedFooterContainer: FC<FixedFooterContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-10 w-full border-t border-gray-200 bg-white px-6 py-4 shadow-md'
      )}
    >
      <div
        className={cn(
          'flex w-full items-center justify-between lg:justify-end lg:gap-6',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { FixedFooterContainer };
